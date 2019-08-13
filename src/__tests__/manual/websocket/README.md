# Test WebSocket support in serverless-offline

## Installation

Set AWS credentials, e.g.: `export AWS_PROFILE=...`

In this directory: `npm i`


## Deploy Data Scheme to AWS

`npm run deploy-aws data`


## Automatically run all tests locally

After installing everything, run:

`npm run test-e2e`

It will locally spawn test servers and run all the test suites.


## Deploying locally - one server at a time

`npm run deploy-offline {main/authorizer/RouteSelection}`


## Deploying locally - all servers at once

`npm run deploy-offline-all`

## Deploying to AWS

`npm run deploy-aws {main/authorizer/RouteSelection\}`


## Testing locally - one test suite at a time

`npm run test ./test/ws.{main/authorizer/RouteSelection}.e2e.js`


## Testing locally - all test suites at once

`npm run test-all`


## Testing on AWS

`npm --endpoint={WebSocket endpoint URL on AWS} --timeout={timeout in ms} run test ./test/ws.{main/authorizer/RouteSelection}.e2e.js`
