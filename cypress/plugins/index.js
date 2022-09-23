/// <reference types="cypress" />
// @ts-check

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

// in the user project it would be
// const createBundler = require('cypress-esbuild-preprocessor')
const createBundler = require('../..')

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // https://esbuild.github.io/plugins/
  const exampleTextLoadPlugin = {
    name: 'exampleTextLoad',
    setup(build) {
      const fs = require('fs')

      // Load ".txt" files and return an array of words
      build.onLoad({ filter: /\.txt$/ }, async (args) => {
        console.log('loading', args)

        const text = await fs.promises.readFile(args.path, 'utf8')
        console.log('read from %s', args.path)
        console.log(text)

        return {
          contents: JSON.stringify(text.split(/\s+/).filter(Boolean)),
          loader: 'json',
        }
      })
    },
  }

  // https://esbuild.github.io/api/
  const esBuildOptions = {
    define: {
      // replaces every instance of "process.env.NODE_ENV" string
      // in the spec with the string "development"
      'process.env.NODE_ENV': '"development"',
      // and replace every instance of "myVariable" with number 42
      myVariable: '42',
    },
    plugins: [exampleTextLoadPlugin],
  }
  const bundler = createBundler(esBuildOptions)
  on('file:preprocessor', bundler)
}
