# Test WebSocket support in serverless-offline

## Installation

In the plugin directory (serverless-offline): `npm link`

Set AWS credentials, e.g.: `export AWS_PROFILE=...`

To start AWS DynamoDB locally (can run only after first deploying locally): `sls dynamodb install` `sls dynamodb start`


## Deploying locally

`npm run deploy-offline` and then `sls offline` for each additional local deploy.


## Deploying to AWS

`npm run deploy-aws` and then `sls deploy` for each additional AWS deploy.


## Testing locally

`npm run test`


## Testing on AWS

`npm --endpoint={WebSocket endpoint URL on AWS} --timeout={timeout in ms} run test`


## Usage Assumption - In order to send messages back to clients
 
`POST http://localhost:3001/@connections/{connectionId}`

Or,

`const endpoint=event.requestContext.domainName+'/'+event.requestContext.stage;`

`const apiVersion='2018-11-29';`

`let API=null;`

`if (!process.env.IS_OFFLINE) {`

`  API = require('aws-sdk');`

`  require('aws-sdk/clients/apigatewaymanagementapi');`

`} else {`

`  API = require('serverless-offline').AWS;`

`}`

`new API.ApiGatewayManagementApi({ apiVersion, endpoint });`



