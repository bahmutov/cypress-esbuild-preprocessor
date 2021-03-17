const esbuild = require('esbuild')
const debug = require('debug')('cypress-esbuild-preprocessor')

const filePreprocessor = (file) => {
  const { filePath, outputPath, shouldWatch } = file

  debug({ filePath, outputPath, shouldWatch })

  esbuild.buildSync({
    entryPoints: [filePath],
    outfile: outputPath,
    bundle: true,
  })
}

export default filePreprocessor
