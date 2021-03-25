# @bahmutov/cypress-esbuild-preprocessor
![cypress version](https://img.shields.io/badge/cypress-6.8.0-brightgreen) ![esbuild version](https://img.shields.io/badge/esbuild-0.9.7-brightgreen) [![ci status][ci image]][ci url]
> Bundle Cypress specs using [esbuild](https://esbuild.github.io/)

## Install

```bash
npm i -D cypress @bahmutov/cypress-esbuild-preprocessor
# note: this plugin assumes the esbuild is peer dependency
```

## Use

In your plugin file use this module as the preprocessor

```js
// cypress/plugins/index.js
module.exports = (on, config) => {
  on('file:preprocessor', require('@bahmutov/cypress-esbuild-preprocessor'))
}
```

## Debugging

Run with the environment variable `DEBUG=cypress-esbuild-preprocessor`

But also if something is not working, check out the alternative package: [cypress-esbuild-preprocessor](https://github.com/sod/cypress-esbuild-preprocessor#readme)

[ci image]: https://github.com/bahmutov/cypress-esbuild-preprocessor/workflows/ci/badge.svg?branch=main
[ci url]: https://github.com/bahmutov/cypress-esbuild-preprocessor/actions
