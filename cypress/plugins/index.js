/// <reference types="cypress" />

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

// in the user project it would be
// const createBundler = require('cypress-esbuild-preprocessor')
const createBundler = require('../..')

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // https://esbuild.github.io/api/
  const esBuildOptions = {
    define: {
      // replaces every instance of "process.env.NODE_ENV" string
      // in the spec with the string "development"
      'process.env.NODE_ENV': '"development"',
      // and replace every instance of "myVariable" with number 42
      myVariable: '42',
    },
  }
  const bundler = createBundler(esBuildOptions)
  on('file:preprocessor', bundler)
}
