# cypress-esbuild-preprocessor
![cypress version](https://img.shields.io/badge/cypress-6.7.1-brightgreen) ![esbuild version](https://img.shields.io/badge/esbuild-0.9.2-brightgreen)
> Bundle Cypress specs using esbuild

## Install

```
npx i -D cypress cypress-esbuild-preprocessor
# note: this plugin assumes the esbuild is peer dependency
```

## Use

In your plugin file use this module as the preprocessor

```js
// cypress/plugins/index.js
module.exports = (on, config) => {
  on('file:preprocessor', require('cypress-esbuild-preprocessor'))
}
```

## Debugging

Run with the environment variable `DEBUG=cypress-esbuild-preprocessor`
