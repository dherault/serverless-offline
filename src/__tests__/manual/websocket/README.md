# Test WebSocket support in serverless-offline

## Installation

In the plugin directory (serverless-offline): `npm link`

Set AWS credentials, e.g.: `export AWS_PROFILE=...`

To start AWS DynamoDB locally (can run only after first deploying locally): `sls dynamodb install` `sls dynamodb start`

### In either main or RouteSelection folder the following:

## Deploying locally

`npm run deploy-offline` and then `sls offline` for each additional local deploy.

npm link serverless-offline


## Deploying to AWS

`npm run deploy-aws` and then `sls deploy` for each additional AWS deploy.


## Testing locally

`npm run test`


## Testing on AWS

`npm --endpoint={WebSocket endpoint URL on AWS} --timeout={timeout in ms} run test`
