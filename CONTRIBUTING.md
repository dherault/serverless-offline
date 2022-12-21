# Contributing

Welcome, and thanks in advance for your help!

# How to contribute

To install all pinned dependencies for `serverless-offline`.

```bash
npm ci
```

# Important

`serverless-offline` is now pure ESM using import/export syntax.

# Development setup

You can test your local changes to `serverless-offline` in multiple ways:

1. point your `serverless.yml` plugin to the root of `serverless-offline`

   ```yaml
   service: foo

   plugins:
     - ./path/to/serverless-offline

   provider:
     memorySize: 1024
     name: aws
     # ....
   ```

2. you can also point your `serverless.yml` plugin to `.src/index.js` of `serverless-offline`

   ```yaml
   service: foo

   plugins:
     - ./path/to/serverless-offline/src/index.js

   provider:
     memorySize: 1024
     name: aws
     # ....
   ```

3. Install the local serverless-offline in your other npm project as a dev dependency

   ```yaml
   service: foo

   plugins:
     - serverless-offline

   provider:
     memorySize: 1024
     name: aws
     # ....
   ```

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

---

# Code Style

We're using Prettier and ESLint (with the Airbnb preset). To fix errors which are automatically fixable, run:

```
npm run format
```

To run the linter, run:

```
npm run lint
```

# Testing

There are a few test scripts, depending on what type of testing you want to run.

**Unit tests**

To run unit tests only:

```
npm run test:unit
```

**Watch mode**

To run all tests in watch mode (this skips `npm install`):

```
npm run test:watch
```

**Test coverage**

```
npm run test:cov
```
