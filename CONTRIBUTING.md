# Contributing

Welcome, and thanks in advance for your help!

# How to contribute to Serverless-Offline

To install all the locked versions for serverless-offline
```bash
npm ci
```

# Development setup

You can test your local changes to serverless-offline if different ways
- Point your **serverless.yml** directly to the local changes
  - agnostic to your tech stack, as long as you have serverless.yml
- Point your npm **package.json** to the local changes
  - depends on an npm project

we are using Babel to transform ES6 modules (static imports and dynamic imports).

## serverless.yml

you have several options:

1. point your `serverless.yml` plugin entry point to `src/main.js`
    (https://github.com/dherault/serverless-offline/blob/master/src/main.js) and
    uncomment the block between `use strict` and `module.exports`. that way,
    babel/register will compile es6 module syntax on the fly.

    (as an alternative you can point the entry point to the package.json of the
    plugin and change `main` to `src/main.js`)

    ```yaml
    service: foo

    plugins:
      - ../../../src/main.js
      # - ../../../  alternative: point to package.json

    provider:
      memorySize: 128
      name: aws
      # ....
    ```

2. run the build step ahead of running the plugin. in that case don't uncomment
    anything in `main.js`!
    ```
    npm run build
    ```
    point your `serverless.yml` plugin entry to the build folder: `./dist/main.js`
    (see 1. on how to)

## package.json

1. Make sure you install/build your local serverless-offline
    ```bash
    # serverless-offline
    npm ci
    npm run build
    ```
2. Install the local serverless-offline in your other npm project as a dev dependency
    ```bash
    # in your-npm-project
    npm i -D serverless-offline@file:../serverless-offline
    ```
    After this, you should see a devDependencies like the following in your package.json
    ```JSON
    {
      "devDependencies": {
        "serverless-offline": "file:serverless-offline"
      }
    }
    ```
3. When you make changes to serverless-offline, re-run the build so Babel will
    re-compile the plugin source
    ```bash
    # serverless-offline
    npm run build
    ```
    The local file include in your-npm-project should have the linked changes in
    it's respective node_modules

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
