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
  debug('bundling %s took %dms', filePath, elapsed)
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

  const esBuildOptions = {
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
  }

  bundled[filePath] = esbuild.build(esBuildOptions).then((watcher) => {
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
