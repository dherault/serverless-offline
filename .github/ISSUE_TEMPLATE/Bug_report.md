---
name: "Bug Report"
about: "If something isn't working as expected."
title: ""
labels: "i: bug, i: needs triage"
assignees: ""
---

## Bug Report

<!-- Before you create a bug report, please make sure to update `serverless` as well as `serverless-offline` to the latest version and make sure the bug hasn't been fixed already.

Please add as much information as you can. e.g. links to any `serverless` or `AWS` documentation, github issues, etc. -->

**Current Behavior**

<!-- Please provide a clear and concise description of the behavior. -->

**Sample Code**

<!-- Please reduce the sample code to an absolute minimum needed to show the problem. Even better, create a small repository and link to it. -->

- file: serverless.yml

```yaml
service: my-service

plugins:
  - serverless-offline

provider:
  runtime: nodejs18.x
  stage: dev

functions:
  hello:
    events:
      - http:
          method: get
          path: hello
    handler: handler.hello
```

- file: handler.js

```js
"use strict"

const { stringify } = JSON

exports.hello = async function hello() {
  return {
    body: stringify({ foo: "bar" }),
    statusCode: 200,
  }
}
```

**Expected behavior/code**

<!-- A clear and concise description of what you expected to happen (or code). -->

**Environment**

- `serverless` version: [e.g. v3.19.0]
- `serverless-offline` version: [e.g. v8.8.0]
- `node.js` version: [e.g. v18.3.0]
- `OS`: [e.g. macOS 12.4, Windows 11, Ubuntu 16.04]

_optional, if you are using any of the following frameworks to invoke handlers_

- `python` version: [e.g. v3.9.0]
- `ruby` version: [e.g. v2.7.0]

**Possible Solution**

<!--- Only if you have suggestions on a fix for the bug -->

**Additional context/Screenshots**

<!-- Add any other context about the problem here. If applicable, add screenshots to help explain. -->
