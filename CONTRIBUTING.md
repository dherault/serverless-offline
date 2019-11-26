# Contributing

Welcome, and thanks in advance for your help!

# How to contribute to Serverless-Offline

# Development setup

we are using Babel to transform ES6 modules (static imports and dynamic imports).

you have several options:

1. point your `serverless.yml` plugin entry point to `src/main.js` (https://github.com/dherault/serverless-offline/blob/master/src/main.js and uncomment the block between `use strict` and `module.exports`. that way, babel/register will compile es6 module syntax on the fly.

(as an alternative you can point the entry point to the package.json of the plugin and change `main` to `src/main.js`)

```yaml
service: foo

plugins:
  - ./../../../src/main.js
  # - ./../../../  alternative: point to package.json

provider:
  memorySize: 128
  name: aws
  # ....
```

2. run the build step ahead of running the plugin. in that case don't uncomment anything in `main.js`!

```
npm run build
```

point your `serverless.yml` plugin entry to the build folder: `./dist/main.js` (see 1. on how to)

---

# Code Style

We're using Prettier, ESlint and the Airbnb preset.

## Verifying linting style

```
npm run lint
```

# Testing

```
npm test
```

# Test coverage

```
npm run test:cov
```
