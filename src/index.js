const esbuild = require('esbuild')
const debug = require('debug')('cypress-esbuild-preprocessor')

// bundled[filename] => promise
const bundled = {}

const bundleOnce = ({ filePath, outputPath, esBuildUserOptions }) => {
  debug('bundleOnce %s', filePath)
  const started = +new Date()

  return esbuild
    .build({
      ...esBuildUserOptions,
      entryPoints: [filePath],
      outfile: outputPath,
      bundle: true,
    })
    .then(() => {
      const finished = +new Date()
      const elapsed = finished - started
      debug('bundling %s took %dms', filePath, elapsed)
    })
}

const createBundler = (esBuildUserOptions = {}) => {
  debug('ESBuild user options %o', esBuildUserOptions)

  return function cypressESBuildFilePreprocessor(file) {
    const { filePath, outputPath, shouldWatch } = file

    debug({ filePath, outputPath, shouldWatch })

    if (!shouldWatch) {
      return bundleOnce({ filePath, outputPath, esBuildUserOptions }).then(
        () => outputPath,
      )
    }

    if (bundled[filePath]) {
      debug('already have bundle promise for file %s', filePath)
      return bundled[filePath]
    }

    const esBuildOptions = {
      // user options
      ...esBuildUserOptions,
      // our options
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
}

module.exports = createBundler
