# Contributing

Welcome, and thanks in advance for your help!

# How to contribute to Serverless-Offline

To install all the locked versions of dependencies for serverless-offline
```bash
npm ci
```

# Development setup

You can test your local changes to serverless-offline

- Point your npm **package.json** to the local changes
  - depends on an npm project


## package.json

1. Make sure you install the dependencies for your local serverless-offline
    ```bash
    # serverless-offline
    npm ci
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
        "serverless-offline": "file:../serverless-offline"
      }
    }
    ```
    The local file-include in your-npm-project should have the linked changes in
    it's respective node_modules

---

# Code Style


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
