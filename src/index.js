const esbuild = require('esbuild')
const debug = require('debug')('cypress-esbuild-preprocessor')

const filePreprocessor = (file) => {
  const { filePath, outputPath, shouldWatch } = file

  debug({ filePath, outputPath, shouldWatch })

  const started = +new Date()

  esbuild.buildSync({
    entryPoints: [filePath],
    outfile: outputPath,
    bundle: true,
  })
  const finished = +new Date()
  const elapsed = finished - started
  debug('bundling took %dms', elapsed)

  return outputPath
}

module.exports = filePreprocessor
