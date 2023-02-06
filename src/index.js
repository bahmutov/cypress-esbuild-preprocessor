const esbuild = require('esbuild')
const debug = require('debug')('cypress-esbuild-preprocessor')

/**
 * @typedef {import("./index.d").BundleOnceParams} BundleOnceParams
 * @typedef {import("./index.d").CypressPlugin} CypressPlugin
 * @typedef {import("esbuild").BuildOptions} BuildOptions
 */

// bundled[filename] => promise
const bundled = {}

/**
 * Bundles the files only once.
 *
 * @param {BundleOnceParams} params
 * @returns {Promise<void>}
 */
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

/**
 * Pass ESBuild options to be applied to each spec file
 *
 * @example
 *
 * const bundler = createBundler({
 *  define: {
 *    "process.env.NODE_ENV": '"development"'
 *  }
 * });
 * on('file:preprocessor', bundler)
 *
 * @param {BuildOptions} esBuildUserOptions
 * @returns {CypressPlugin}
 */
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
    }
    // our plugin for new watch mode of esbuild 0.17.0
    const customBuildPlugin = {
      name: 'cypress-esbuild-watch-plugin',
      setup(build) {
        build.onEnd(result => {
          debug(
            'watch on %s build succeeded, warnings %o',
            filePath,
            result.warnings,
          )
          file.emit('rerun')
        });
      },
    }
    const plugins = esBuildOptions.plugins ? [...esBuildOptions.plugins, customBuildPlugin] : [customBuildPlugin];
    bundled[filePath] = esbuild.context({...esBuildOptions, plugins}).then((watcher) => {
      watcher.watch().then((_) => {
        // when the test runner closes this spec
        file.on('close', () => {
          debug('file %s close, removing bundle promise', filePath)
          delete bundled[filePath]
          watcher.dispose()
        })
      })

      return outputPath
    })

    return bundled[filePath]
  }
}

module.exports = createBundler
