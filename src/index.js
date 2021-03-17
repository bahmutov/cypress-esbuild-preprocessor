const esbuild = require('esbuild')
const debug = require('debug')('cypress-esbuild-preprocessor')

// bundled[filename] => promise
const bundled = {}

const bundleOnce = ({ filePath, outputPath }) => {
  const started = +new Date()

  esbuild.buildSync({
    entryPoints: [filePath],
    outfile: outputPath,
    bundle: true,
  })
  const finished = +new Date()
  const elapsed = finished - started
  debug('bundling took %dms', elapsed)
}

const filePreprocessor = (file) => {
  const { filePath, outputPath, shouldWatch } = file

  debug({ filePath, outputPath, shouldWatch })

  if (!shouldWatch) {
    bundleOnce({ filePath, outputPath })
    return outputPath
  }

  if (bundled[filePath]) {
    debug('already have bundle promise for file %s', filePath)
    return bundled[filePath]
  }

  bundled[filePath] = esbuild
    .build({
      entryPoints: [filePath],
      outfile: outputPath,
      bundle: true,
      // https://esbuild.github.io/api/#watch
      watch: {
        onRebuild(error, result) {
          if (error) {
            console.error('watch build failed:', error)
          } else {
            debug(
              'watch on %s build succeeded, warnings %o',
              filePath,
              result.warnings,
            )
            file.emit('rerun')
          }
        },
      },
    })
    .then((watcher) => {
      // when the test runner closes this spec
      file.on('close', () => {
        debug('file %s close, removing bundle promise', filePath)
        delete bundled[filePath]
        watcher.stop()
      })

      return outputPath
    })

  return bundled[filePath]
}

module.exports = filePreprocessor
