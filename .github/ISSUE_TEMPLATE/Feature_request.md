---
name: "Feature request"
about: "I have a suggestion (and may want to implement it)."
title: ""
labels: "i: enhancement, i: needs triage"
assignees: ""
---

## Feature Request

<!-- Before you create a feature request, please make sure to update `serverless` as well as `serverless-offline` to the latest version and make sure the feature hasn't been implemented already.

Please add as much information as you can. e.g. links to any `serverless` or `AWS` documentation, github issues, etc. -->

**Sample Code**

<!-- Please reduce the sample code to an absolute minimum needed to show the missing feature. -->

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

**Additional context/Screenshots**

<!-- Add any other context about the feature here. If applicable, add screenshots to help explain. -->
