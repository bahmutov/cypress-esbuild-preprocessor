# @bahmutov/cypress-esbuild-preprocessor
![cypress version](https://img.shields.io/badge/cypress-9.5.2-brightgreen) ![esbuild version](https://img.shields.io/badge/esbuild-0.14.27-brightgreen) [![ci status][ci image]][ci url]
> Bundle Cypress specs using [esbuild](https://esbuild.github.io/)

## Install

```bash
npm i -D cypress @bahmutov/cypress-esbuild-preprocessor esbuild
# note: this plugin assumes the esbuild is peer dependency
```

## Use

In your plugin file use this module as the preprocessor

```js
// cypress/plugins/index.js
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
module.exports = (on, config) => {
  on('file:preprocessor', createBundler())
}
```

### ESBuild options

If you want to pass your own [ESBuild options](https://esbuild.github.io/api/)

```js
// cypress/plugins/index.js
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
module.exports = (on, config) => {
  const bundler = createBundler({
    // any ESBuild options here
    // https://esbuild.github.io/api/
  })
  on('file:preprocessor', bundler)
}
```

## Debugging

Run with the environment variable `DEBUG=cypress-esbuild-preprocessor`

But also if something is not working, check out the alternative package: [cypress-esbuild-preprocessor](https://github.com/sod/cypress-esbuild-preprocessor#readme)

## Breaking changes

### v1 to v2

- instead of the file preprocessor, exposes a constructor function to allow user options to ESBuild

```js
// v1
const bundler = require('cypress-esbuild-preprocessor')
module.exports = (on, config) => {
  on('file:preprocessor', bundler)
}

// v2
const createBundler = require('cypress-esbuild-preprocessor')
module.exports = (on, config) => {
  // pass ESBuild options to be applied to each spec file
  const bundler = createBundler({
    define: {
      "process.env.NODE_ENV": '"development"'
    }
  })
  on('file:preprocessor', bundler)
}
```

[ci image]: https://github.com/bahmutov/cypress-esbuild-preprocessor/workflows/ci/badge.svg?branch=main
[ci url]: https://github.com/bahmutov/cypress-esbuild-preprocessor/actions
