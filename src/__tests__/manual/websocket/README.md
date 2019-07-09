# Test WebSocket support in serverless-offline

## Installation

In the plugin directory (serverless-offline): `npm link`

Set AWS credentials, e.g.: `export AWS_PROFILE=...`

To start AWS DynamoDB locally (can run only after first deploying locally): `sls dynamodb install` `sls dynamodb start`

### In either main or RouteSelection folder the following:

## Deploying locally

`npm run deploy-offline {main/authorizer/RouteSelection}`


## Deploying to AWS

`npm run deploy-aws {main/authorizer/RouteSelection\}`


## Testing locally

`npm run test ./test/ws.{main/authorizer/RouteSelection}.e2e.js`


## Testing on AWS

`npm --endpoint={WebSocket endpoint URL on AWS} --timeout={timeout in ms} run test ./test/ws.{main/authorizer/RouteSelection}.e2e.js`
