# Serverless Offline

<p>
  <a href="https://www.serverless.com">
    <img src="http://public.serverless.com/badges/v3.svg">
  </a>
  <a href="https://www.npmjs.com/package/serverless-offline">
    <img src="https://img.shields.io/npm/v/serverless-offline.svg?style=flat-square">
  </a>
  <a href="https://github.com/dherault/serverless-offline/actions/workflows/integrate.yml">
    <img src="https://img.shields.io/github/workflow/status/dherault/serverless-offline/Integrate">
  </a>
  <img src="https://img.shields.io/node/v/serverless-offline.svg?style=flat-square">
  <a href="https://github.com/serverless/serverless">
    <img src="https://img.shields.io/npm/dependency-version/serverless-offline/peer/serverless.svg?style=flat-square">
  </a>
  <a href="https://github.com/prettier/prettier">
    <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">
  </a>
  <img src="https://img.shields.io/npm/l/serverless-offline.svg?style=flat-square">
  <a href="#contributing">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square">
  </a>
  <a href="https://gitter.im/serverless-offline/community">
    <img src="https://badges.gitter.im/serverless-offline.png">
  </a>
</p>

This [Serverless](https://github.com/serverless/serverless) plugin emulates [AWS λ](https://aws.amazon.com/lambda) and [API Gateway](https://aws.amazon.com/api-gateway) on your local machine to speed up your development cycles.
To do so, it starts an HTTP server that handles the request's lifecycle like APIG does and invokes your handlers.

**Features**

- [Node.js](https://nodejs.org), [Python](https://www.python.org), [Ruby](https://www.ruby-lang.org), [Go](https://golang.org), [Java](https://www.java.com) (incl. [Kotlin](https://kotlinlang.org), [Groovy](https://groovy-lang.org), [Scala](https://www.scala-lang.org)) λ runtimes.
- Velocity templates support.
- Lazy loading of your handler files.
- And more: integrations, authorizers, proxies, timeouts, responseParameters, HTTPS, CORS, etc...

This plugin is updated by its users, I just do maintenance and ensure that PRs are relevant to the community. In other words, if you [find a bug or want a new feature](https://github.com/dherault/serverless-offline/issues), please help us by becoming one of the [contributors](https://github.com/dherault/serverless-offline/graphs/contributors) :v: ! See the [contributing section](#contributing).

## Documentation

- [Installation](#installation)
- [Usage and command line options](#usage-and-command-line-options)
- [Run modes](#run-modes)
- [Invoke Lambda](#invoke-lambda)
- [The `process.env.IS_OFFLINE` variable](#the-processenvis_offline-variable)
- [Docker and Layers](#docker-and-layers)
- [Authorizers](#authorizers)
  - [Token authorizers](#token-authorizers)
  - [Custom authorizers](#custom-authorizers)
  - [Remote authorizers](#remote-authorizers)
  - [JWT authorizers](#jwt-authorizers)
  - [Serverless plugin authorizers](#serverless-plugin-authorizers)
- [Custom headers](#custom-headers)
- [Environment variables](#environment-variables)
- [AWS API Gateway Features](#aws-api-gateway-features)
  - [Velocity Templates](#velocity-templates)
    - [Velocity nuances](#velocity-nuances)
  - [CORS](#cors)
  - [Catch-all Path Variables](#catch-all-path-variables)
  - [ANY method](#any-method)
  - [Lambda and Lambda Proxy Integrations](#lambda-and-lambda-proxy-integrations)
  - [HTTP Proxy](#http-proxy)
  - [Response parameters](#response-parameters)
- [WebSocket](#websocket)
- [Debug process](#debug-process)
- [Resource permissions and AWS profile](#resource-permissions-and-aws-profile)
- [Simulation quality](#simulation-quality)
- [Usage with other plugins](#usage-with-other-plugins)
- [Credits and inspiration](#credits-and-inspiration)
- [License](#license)
- [Contributing](#contributing)
- [Contributors](#contributors)

## Installation

First, add Serverless Offline to your project:

`npm install serverless-offline --save-dev`

Then inside your project's `serverless.yml` file add following entry to the plugins section: `serverless-offline`. If there is no plugin section you will need to add it to the file.

**Note that the "plugin" section for serverless-offline must be at root level on serverless.yml.**

It should look something like this:

```yml
plugins:
  - serverless-offline
```

You can check whether you have successfully installed the plugin by running the serverless command line:

`serverless --verbose`

the console should display _Offline_ as one of the plugins now available in your Serverless project.

## Usage and command line options

In your project root run:

`serverless offline` or `sls offline`.

to list all the options for the plugin run:

`sls offline --help`

All CLI options are optional:

#### corsAllowHeaders

Used as default Access-Control-Allow-Headers header value for responses. Delimit multiple values with commas.<br />
Default: 'accept,content-type,x-api-key'

#### corsAllowOrigin

Used as default Access-Control-Allow-Origin header value for responses. Delimit multiple values with commas.<br />
Default: '\*'

#### corsDisallowCredentials

When provided, the default Access-Control-Allow-Credentials header value will be passed as 'false'.\
Default: true

#### corsExposedHeaders

Used as additional Access-Control-Exposed-Headers header value for responses. Delimit multiple values with commas.<br />
Default: 'WWW-Authenticate,Server-Authorization'

#### disableCookieValidation

Used to disable cookie-validation on hapi.js-server.

#### dockerHost

The host name of Docker.<br />
Default: localhost

#### dockerHostServicePath

Defines service path which is used by SLS running inside Docker container.

#### dockerNetwork

The network that the Docker container will connect to.

#### dockerReadOnly

Marks if the docker code layer should be read only.<br />
Default: true

#### enforceSecureCookies

Enforce secure cookies

#### host

-o Host name to listen on.<br />
Default: localhost

#### httpPort

Http port to listen on.<br />
Default: 3000

#### httpsProtocol

-H To enable HTTPS, specify directory (relative to your cwd, typically your project dir) for both cert.pem and key.pem files.

#### ignoreJWTSignature

When using HttpApi with a JWT authorizer, don't check the signature of the JWT token.

#### lambdaPort

Lambda http port to listen on.<br />
Default: 3002

#### layersDir

The directory layers should be stored in.<br />
Default: ${codeDir}/.serverless-offline/layers'

#### localEnvironment

Copy local environment variables.<br />
Default: false

#### noAuth

Turns off all authorizers.

#### noPrependStageInUrl

Don't prepend http routes with the stage.

#### noTimeout

-t Disables the timeout feature.

#### prefix

-p Adds a prefix to every path, to send your requests to http://localhost:3000/[prefix]/[your_path] instead.<br />
Default: ''

#### reloadHandler

Reloads handler with each request.

#### resourceRoutes

Turns on loading of your HTTP proxy settings from serverless.yml.

#### terminateIdleLambdaTime

Number of seconds until an idle function is eligible for termination.

#### useDocker

Run handlers in a docker container.

#### useInProcess

Run handlers in the same process as 'serverless-offline'.

#### webSocketHardTimeout

Set WebSocket hard timeout in seconds to reproduce AWS limits (https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html#apigateway-execution-service-websocket-limits-table).<br />
Default: 7200 (2 hours)

#### webSocketIdleTimeout

Set WebSocket idle timeout in seconds to reproduce AWS limits (https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html#apigateway-execution-service-websocket-limits-table).<br />
Default: 600 (10 minutes)

#### websocketPort

WebSocket port to listen on.<br />
Default: 3001

Any of the CLI options can be added to your `serverless.yml`. For example:

```yml
custom:
  serverless-offline:
    httpsProtocol: 'dev-certs'
    httpPort: 4000
      foo: 'bar'
```

Options passed on the command line override YAML options.

By default you can send your requests to `http://localhost:3000/`. Please note that:

- You'll need to restart the plugin if you modify your `serverless.yml` or any of the default velocity template files.
- When no Content-Type header is set on a request, API Gateway defaults to `application/json`, and so does the plugin.
  But if you send an `application/x-www-form-urlencoded` or a `multipart/form-data` body with an `application/json` (or no) Content-Type, API Gateway won't parse your data (you'll get the ugly raw as input), whereas the plugin will answer 400 (malformed JSON).
  Please consider explicitly setting your requests' Content-Type and using separate templates.

## Run modes

### node.js

Lambda handlers with `serverless-offline` for the `node.js` runtime can run in different execution modes and have some differences with a variety of pros and cons. they are currently mutually exclusive and it's not possible to use a combination, e.g. use `in-process` for one Lambda, and `worker-threads` for another. It is planned to combine the flags into one single flag in the future and also add support for combining run modes.

#### worker-threads (default)

- handlers run in their own context
- memory is not being shared between handlers, memory consumption is therefore higher
- memory is being released when handlers reload or after usage
- environment (process.env) is not being shared across handlers
- global state is not being shared across handlers
- easy debugging

NOTE:

- native modules need to be a Node-API addon or be declared as context-aware using NODE_MODULE_INIT(): https://nodejs.org/docs/latest/api/addons.html#worker-support

#### in-process

- handlers run in the same context (instance) as `serverless` and `serverless-offline`
- memory is being shared across lambda handlers as well as with `serverless` and `serverless-offline`
- no reloading capabilities as it is [currently] not possible to implement for commonjs handlers (without memory leaks) and for esm handlers
- environment (process.env) is being shared across handlers as well as with `serverless` and `serverless-offline`
- global state is being shared across lambda handlers as well as with `serverless` and `serverless-offline`
- easy debugging

#### docker

- handlers run in a docker container
- memory is not being shared between handlers, memory consumption is therefore higher
- memory is being released when handlers reload or after usage
- environment (process.env) is not being shared across handlers
- global state is not being shared across handlers
- debugging more complicated

### Python, Ruby, Go, Java (incl. Kotlin, Groovy, Scala)

the Lambda handler process is running in a child process.

## Invoke Lambda

To use `Lambda.invoke` you need to set the lambda endpoint to the `serverless-offline` endpoint:

```js
import { env } from 'node:process'
import aws from 'aws-sdk'

const lambda = new aws.Lambda({
  apiVersion: '2015-03-31',
  // endpoint needs to be set only if it deviates from the default
  endpoint: env.IS_OFFLINE
    ? 'http://localhost:3002'
    : 'https://lambda.us-east-1.amazonaws.com',
})
```

All your lambdas can then be invoked in a handler using

```js
import { Buffer } from 'node:buffer'
import aws from 'aws-sdk'

const { stringify } = JSON

const lambda = new aws.Lambda({
  apiVersion: '2015-03-31',
  endpoint: 'http://localhost:3002',
})

export async function handler() {
  const clientContextData = stringify({
    foo: 'foo',
  })

  const payload = stringify({
    data: 'foo',
  })

  const params = {
    ClientContext: Buffer.from(clientContextData).toString('base64'),
    // FunctionName is composed of: service name - stage - function name, e.g.
    FunctionName: 'myServiceName-dev-invokedHandler',
    InvocationType: 'RequestResponse',
    Payload: payload,
  }

  const response = await lambda.invoke(params).promise()

  return {
    body: stringify(response),
    statusCode: 200,
  }
}
```

You can also invoke using the aws cli by specifying `--endpoint-url`

```
aws lambda invoke /dev/null \
  --endpoint-url http://localhost:3002 \
  --function-name myServiceName-dev-invokedHandler
```

List of available function names and their corresponding serverless.yml function keys
are listed after the server starts. This is important if you use a custom naming
scheme for your functions as `serverless-offline` will use your custom name.
The left side is the function's key in your `serverless.yml`
(`invokedHandler` in the example below) and the right side is the function name
that is used to call the function externally such as `aws-sdk`
(`myServiceName-dev-invokedHandler` in the example below):

```
serverless offline
...
offline: Starting Offline: local/us-east-1.
offline: Offline [http for lambda] listening on http://localhost:3002
offline: Function names exposed for local invocation by aws-sdk:
           * invokedHandler: myServiceName-dev-invokedHandler
```

To list the available manual invocation paths exposed for targeting
by `aws-sdk` and `aws-cli`, use `SLS_DEBUG=*` with `serverless offline`. After the invoke server starts up, full list of endpoints will be displayed:

```
SLS_DEBUG=* serverless offline
...
offline: Starting Offline: local/us-east-1.
...
offline: Offline [http for lambda] listening on http://localhost:3002
offline: Function names exposed for local invocation by aws-sdk:
           * invokedHandler: myServiceName-dev-invokedHandler
[offline] Lambda Invocation Routes (for AWS SDK or AWS CLI):
           * POST http://localhost:3002/2015-03-31/functions/myServiceName-dev-invokedHandler/invocations
[offline] Lambda Async Invocation Routes (for AWS SDK or AWS CLI):
           * POST http://localhost:3002/2014-11-13/functions/myServiceName-dev-invokedHandler/invoke-async/
```

You can manually target these endpoints with a REST client to debug your lambda
function if you want to. Your `POST` JSON body will be the `Payload` passed to your function if you were
to calling it via `aws-sdk`.

## The `process.env.IS_OFFLINE` variable

Will be `"true"` in your handlers when using `serverless-offline`.

## Docker and Layers

To use layers with serverless-offline, you need to have the `useDocker` option set to true. This can either be by using the `--useDocker` command, or in your serverless.yml like this:

```yml
custom:
  serverless-offline:
    useDocker: true
```

This will allow the docker container to look up any information about layers, download and use them. For this to work, you must be using:

- AWS as a provider, it won't work with other provider types.
- Layers that are compatible with your runtime.
- ARNs for layers. Local layers aren't supported as yet.
- A local AWS account set-up that can query and download layers.

If you're using least-privilege principals for your AWS roles, this policy should get you by:

```json
{
  "Statement": [
    {
      "Action": "lambda:GetLayerVersion",
      "Effect": "Allow",
      "Resource": "arn:aws:lambda:*:*:layer:*:*"
    }
  ],
  "Version": "2012-10-17"
}
```

Once you run a function that boots up the Docker container, it'll look through the layers for that function, download them in order to your layers folder, and save a hash of your layers so it can be re-used in future. You'll only need to re-download your layers if they change in the future. If you want your layers to re-download, simply remove your layers folder.

You should then be able to invoke functions as normal, and they're executed against the layers in your docker container.

### Additional Options

There are 5 additional options available for Docker and Layer usage.

- dockerHost
- dockerHostServicePath
- dockerNetwork
- dockerReadOnly
- layersDir

#### dockerHost

When running Docker Lambda inside another Docker container, you may need to configure the host name for the host machine to resolve networking issues between Docker Lambda and the host. Typically in such cases you would set this to `host.docker.internal`.

#### dockerHostServicePath

When running Docker Lambda inside another Docker container, you may need to override the code path that gets mounted to the Docker Lambda container relative to the host machine. Typically in such cases you would set this to `${PWD}`.

#### dockerNetwork

When running Docker Lambda inside another Docker container, you may need to override network that Docker Lambda connects to in order to communicate with other containers.

#### dockerReadOnly

For certain programming languages and frameworks, it's desirable to be able to write to the filesystem for things like testing with local SQLite databases, or other testing-only modifications. For this, you can set `dockerReadOnly: false`, and this will allow local filesystem modifications. This does not strictly mimic AWS Lambda, as Lambda has a Read-Only filesystem, so this should be used as a last resort.

#### layersDir

By default layers are downloaded on a per-project basis, however, if you want to share them across projects, you can download them to a common place. For example, `layersDir: /tmp/layers` would allow them to be shared across projects. Make sure when using this setting that the directory you are writing layers to can be shared by docker.

## Authorizers

### Token authorizers

As defined in the [Serverless Documentation](https://serverless.com/framework/docs/providers/aws/events/apigateway/#setting-api-keys-for-your-rest-api) you can use API Keys as a simple authentication method.

Serverless-offline will emulate the behaviour of APIG and create a random token that's printed on the screen. With this token you can access your private methods adding `x-api-key: generatedToken` to your request header. All api keys will share the same token.

### Custom authorizers

Only [custom authorizers](https://aws.amazon.com/blogs/compute/introducing-custom-authorizers-in-amazon-api-gateway/) are supported. Custom authorizers are executed before a Lambda function is executed and return an Error or a Policy document.

The Custom authorizer is passed an `event` object as below:

```js
{
  "authorizationToken": "<Incoming bearer token>",
  "methodArn": "arn:aws:execute-api:<Region id>:<Account id>:<API id>/<Stage>/<Method>/<Resource path>",
  "type": "TOKEN"
}
```

The `methodArn` does not include the Account id or API id.

The plugin only supports retrieving Tokens from headers. You can configure the header as below:

```js
"authorizer": {
  "authorizerResultTtlInSeconds": "0",
  "identitySource": "method.request.header.Authorization", // or method.request.header.SomeOtherHeader
  "type": "TOKEN"
}
```

### Remote authorizers

You are able to mock the response from remote authorizers by setting the environmental variable `AUTHORIZER` before running `sls offline start`

Example:

> Unix: `export AUTHORIZER='{"principalId": "123"}'`

> Windows: `SET AUTHORIZER='{"principalId": "123"}'`

### JWT authorizers

For HTTP APIs, [JWT authorizers](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html)
defined in the `serverless.yml` can be used to validate the token and scopes in the token. However at this time,
the signature of the JWT is not validated with the defined issuer. Since this is a security risk, this feature is
only enabled with the `--ignoreJWTSignature` flag. Make sure to only set this flag for local development work.

### Serverless plugin authorizers

If your authentication needs are custom and not satisfied by the existing capabilities of the Serverless offline project, you can inject your own authentication strategy. To inject a custom strategy for Lambda invocation, you define a custom variable under `offline` called `customAuthenticationProvider` in the serverless.yml file. The value of the custom variable will be used to `require(your customAuthenticationProvider value)` where the location is expected to return a function with the following signature.

```yaml
offline:
  customAuthenticationProvider: ./path/to/custom-authentication-provider
```

```js
// ./path/to/customer-authentication-provider.js

module.exports = function (endpoint, functionKey, method, path) {
  return {
    getAuthenticateFunction() {
      return {
        async authenticate(request, h) {
          // your implementation
        },
      }
    },

    name: 'your strategy name',
    scheme: 'your scheme name',
  }
}
```

A working example of injecting a custom authorization provider can be found in the projects integration tests under the folder [`custom-authentication`](./tests/integration/custom-authentication).

## Custom headers

You are able to use some custom headers in your request to gain more control over the requestContext object.

| Header                          | Event key                                                   | Example                                                                           |
| ------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------- |
| cognito-identity-id             | event.requestContext.identity.cognitoIdentityId             |                                                                                   |
| cognito-authentication-provider | event.requestContext.identity.cognitoAuthenticationProvider |                                                                                   |
| sls-offline-authorizer-override | event.requestContext.authorizer                             | { "iam": {"cognitoUser": { "amr": ["unauthenticated"], "identityId": "abc123" }}} |

By doing this you are now able to change those values using a custom header. This can help you with easier authentication or retrieving the userId from a `cognitoAuthenticationProvider` value.

## Environment variables

You are able to use environment variables to customize identity params in event context.

| Environment Variable                | Event key                                                   |
| ----------------------------------- | ----------------------------------------------------------- |
| SLS_COGNITO_IDENTITY_POOL_ID        | event.requestContext.identity.cognitoIdentityPoolId         |
| SLS_ACCOUNT_ID                      | event.requestContext.identity.accountId                     |
| SLS_COGNITO_IDENTITY_ID             | event.requestContext.identity.cognitoIdentityId             |
| SLS_CALLER                          | event.requestContext.identity.caller                        |
| SLS_API_KEY                         | event.requestContext.identity.apiKey                        |
| SLS_API_KEY_ID                      | event.requestContext.identity.apiKeyId                      |
| SLS_COGNITO_AUTHENTICATION_TYPE     | event.requestContext.identity.cognitoAuthenticationType     |
| SLS_COGNITO_AUTHENTICATION_PROVIDER | event.requestContext.identity.cognitoAuthenticationProvider |

You can use [serverless-dotenv-plugin](https://github.com/colynb/serverless-dotenv-plugin) to load environment variables from your `.env` file.

## AWS API Gateway Features

### Velocity Templates

[Serverless doc](https://serverless.com/framework/docs/providers/aws/events/apigateway#request-templates)
~ [AWS doc](http://docs.aws.amazon.com/apigateway/latest/developerguide/models-mappings.html#models-mappings-mappings)

You can supply response and request templates for each function. This is optional. To do so you will have to place function specific template files in the same directory as your function file and add the .req.vm extension to the template filename.
For example,
if your function is in code-file: `helloworld.js`,
your response template should be in file: `helloworld.res.vm` and your request template in file `helloworld.req.vm`.

#### Velocity nuances

Consider this requestTemplate for a POST endpoint:

```json
"application/json": {
  "payload": "$input.json('$')",
  "id_json": "$input.json('$.id')",
  "id_path": "$input.path('$').id"
}
```

Now let's make a request with this body: `{ "id": 1 }`

AWS parses the event as such:

```js
{
  "payload": {
    "id": 1
  },
  "id_json": 1,
  "id_path": "1" // Notice the string
}
```

Whereas Offline parses:

```js
{
  "payload": {
    "id": 1
  },
  "id_json": 1,
  "id_path": 1 // Notice the number
}
```

Accessing an attribute after using `$input.path` will return a string on AWS (expect strings like `"1"` or `"true"`) but not with Offline (`1` or `true`).
You may find other differences.

### CORS

[Serverless doc](https://serverless.com/framework/docs/providers/aws/events/apigateway#enabling-cors)

For HTTP APIs, the CORS configuration will work out of the box. Any CLI arguments
passed in will be ignored.

For REST APIs, if the endpoint config has CORS set to true, the plugin will use the CLI CORS options for the associated route.
Otherwise, no CORS headers will be added.

### Catch-all Path Variables

[AWS doc](https://aws.amazon.com/blogs/aws/api-gateway-update-new-features-simplify-api-development/)

Set greedy paths like `/store/{proxy+}` that will intercept requests made to `/store/list-products`, `/store/add-product`, etc...

### ANY method

[AWS doc](https://aws.amazon.com/blogs/aws/api-gateway-update-new-features-simplify-api-development/)

Works out of the box.

### Lambda and Lambda Proxy Integrations

[Serverless doc](https://serverless.com/framework/docs/providers/aws/events/apigateway#lambda-proxy-integration)
~ [AWS doc](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html)

Works out of the box. See examples in the manual_test directory.

### HTTP Proxy

[Serverless doc](https://serverless.com/framework/docs/providers/aws/events/apigateway#setting-an-http-proxy-on-api-gateway)
~
[AWS doc - AWS::ApiGateway::Method](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html)
~
[AWS doc - AWS::ApiGateway::Resource](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-resource.html)

Example of enabling proxy:

```yml
custom:
  serverless-offline:
    resourceRoutes: true
```

or

```yml
    YourCloudFormationMethodId:
      Properties:
        ......
        Integration:
          Type: HTTP_PROXY
          Uri: 'https://s3-${self:custom.region}.amazonaws.com/${self:custom.yourBucketName}/{proxy}'
          ......
      Type: AWS::ApiGateway::Method
```

```yml
custom:
  serverless-offline:
    resourceRoutes:
      YourCloudFormationMethodId:
        Uri: 'http://localhost:3001/assets/{proxy}'
```

### Response parameters

[AWS doc](http://docs.aws.amazon.com/apigateway/latest/developerguide/request-response-data-mappings.html#mapping-response-parameters)

You can set your response's headers using ResponseParameters.

May not work properly. Please PR. (Difficulty: hard?)

Example response velocity template:

```js
"responseParameters": {
  "method.response.header.X-Powered-By": "Serverless", // a string
  "method.response.header.Warning": "integration.response.body", // the whole response
  "method.response.header.Location": "integration.response.body.some.key" // a pseudo JSON-path
},
```

## WebSocket

Usage in order to send messages back to clients:

`POST http://localhost:3001/@connections/{connectionId}`

Or,

```js
import aws from 'aws-sdk'

const apiGatewayManagementApi = new aws.ApiGatewayManagementApi({
  apiVersion: '2018-11-29',
  endpoint: 'http://localhost:3001',
});

apiGatewayManagementApi.postToConnection({
  ConnectionId: ...,
  Data: ...,
});
```

Where the `event` is received in the lambda handler function.

There's support for [websocketsApiRouteSelectionExpression](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api-selection-expressions.html) in it's basic form: `$request.body.x.y.z`, where the default value is `$request.body.action`.

## Debug process

Serverless offline plugin will respond to the overall framework settings and output additional information to the console in debug mode. In order to do this you will have to set the `SLS_DEBUG` environmental variable. You can run the following in the command line to switch to debug mode execution.

> Unix: `export SLS_DEBUG=*`

> Windows: `SET SLS_DEBUG=*`

Interactive debugging is also possible for your project if you have installed the node-inspector module and chrome browser. You can then run the following command line inside your project's root.

Initial installation:
`npm install -g node-inspector`

For each debug run:
`node-debug sls offline`

The system will start in wait status. This will also automatically start the chrome browser and wait for you to set breakpoints for inspection. Set the breakpoints as needed and, then, click the play button for the debugging to continue.

Depending on the breakpoint, you may need to call the URL path for your function in separate browser window for your serverless function to be run and made available for debugging.

### Interactive Debugging with Visual Studio Code (VSC)

With newer versions of node (6.3+) the node inspector is already part of your node environment and you can take advantage of debugging inside your IDE with source-map support. Here is the example configuration to debug interactively with VSC. It has two steps.

#### Step 1 : Adding a launch configuration in IDE

Add a new [launch configuration](https://code.visualstudio.com/docs/editor/debugging) to VSC like this:

```json
{
  "cwd": "${workspaceFolder}",
  "name": "Debug Serverless Offline",
  "request": "launch",
  "runtimeArgs": ["run", "debug"],
  "runtimeExecutable": "npm",
  "sourceMaps": true,
  "type": "node"
}
```

#### Step2 : Adding a debug script

You will also need to add a `debug` script reference in your `package.json file`

Add this to the `scripts` section:

> Unix/Mac: `"debug" : "export SLS_DEBUG=* && node --inspect /usr/local/bin/serverless offline"`

> Windows: `"debug": "SET SLS_DEBUG=* && node --inspect node_modules\\serverless\\bin\\serverless offline"`

Example:

```json
....
"scripts": {
  "debug" : "SET SLS_DEBUG=* && node --inspect node_modules\\serverless\\bin\\serverless offline"
}
```

In VSC, you can, then, add breakpoints to your code. To start a debug sessions you can either start your script in `package.json` by clicking the hovering debug intellisense icon or by going to your debug pane and selecting the Debug Serverless Offline configuration.

## Resource permissions and AWS profile

Lambda functions assume an IAM role during execution: the framework creates this role and set all the permission provided in the `iamRoleStatements` section of `serverless.yml`.

However, serverless offline makes use of your local AWS profile credentials to run the lambda functions and that might result in a different set of permissions. By default, the aws-sdk would load credentials for you default AWS profile specified in your configuration file.

You can change this profile directly in the code or by setting proper environment variables. Setting the `AWS_PROFILE` environment variable before calling `serverless` offline to a different profile would effectively change the credentials, e.g.

`AWS_PROFILE=<profile> serverless offline`

## Simulation quality

This plugin simulates API Gateway for many practical purposes, good enough for development - but is not a perfect simulator.
Specifically, Lambda currently runs on Node.js v12.x, v14.x and v16.x ([AWS Docs](https://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html)), whereas _Offline_ runs on your own runtime where no memory limits are enforced.

## Usage with other plugins

When combining this plugin with other plugins there are a few things that you need to keep in mind.

You should run `serverless offline start` instead of `serverless offline`. The `start` command fires the `offline:start:init` and `offline:start:end` lifecycle hooks which can be used by other plugins to process your code, add resources, perform cleanups, etc.

The order in which plugins are added to `serverless.yml` is relevant.
Plugins are executed in order, so plugins that process your code or add resources should be added first so they are ready when this plugin starts.

For example:

```yml
plugins:
  - serverless-middleware # modifies some of your handler based on configuration
  - serverless-webpack # package your javascript handlers using webpack
  - serverless-dynamodb-local # adds a local dynamo db
  - serverless-offline # runs last so your code has been pre-processed and dynamo is ready
```

That works because all those plugins listen to the `offline:start:init` to do their processing.
Similarly they listen to `offline:start:end` to perform cleanup (stop dynamo db, remove temporary files, etc).

## Credits and inspiration

This plugin was initially a fork of [Nopik](https://github.com/Nopik/)'s [Serverless-serve](https://github.com/Nopik/serverless-serve).

## License

MIT

## Contributing

Yes, thank you!
This plugin is community-driven, most of its features are from different authors.
Please update the docs and tests and add your name to the package.json file.
We try to follow [Airbnb's JavaScript Style Guide](https://github.com/airbnb/javascript).

## Contributors

| [<img alt="dnalborczyk" src="https://avatars1.githubusercontent.com/u/2903325?v=4&s=117" width="117">](https://github.com/dnalborczyk) | [<img alt="dherault" src="https://avatars2.githubusercontent.com/u/4154003?v=4&s=117" width="117">](https://github.com/dherault) | [<img alt="computerpunc" src="https://avatars3.githubusercontent.com/u/721008?v=4&s=117" width="117">](https://github.com/computerpunc) | [<img alt="leonardoalifraco" src="https://avatars0.githubusercontent.com/u/2942943?v=4&s=117" width="117">](https://github.com/leonardoalifraco) | [<img alt="daniel-cottone" src="https://avatars3.githubusercontent.com/u/26556340?v=4&s=117" width="117">](https://github.com/daniel-cottone) |
| :------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------: |
|                                             [dnalborczyk](https://github.com/dnalborczyk)                                              |                                             [dherault](https://github.com/dherault)                                              |                                             [computerpunc](https://github.com/computerpunc)                                             |                                             [leonardoalifraco](https://github.com/leonardoalifraco)                                              |                                              [daniel-cottone](https://github.com/daniel-cottone)                                              |

| [<img alt="mikestaub" src="https://avatars2.githubusercontent.com/u/1254558?v=4&s=117" width="117">](https://github.com/mikestaub) | [<img alt="Bilal-S" src="https://avatars0.githubusercontent.com/u/668901?v=4&s=117" width="117">](https://github.com/Bilal-S) | [<img alt="dl748" src="https://avatars1.githubusercontent.com/u/4815868?v=4&s=117" width="117">](https://github.com/dl748) | [<img alt="frsechet" src="https://avatars3.githubusercontent.com/u/7351940?v=4&s=117" width="117">](https://github.com/frsechet) | [<img alt="zoellner" src="https://avatars2.githubusercontent.com/u/2665319?v=4&s=117" width="117">](https://github.com/zoellner) |
| :--------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------: |
|                                             [mikestaub](https://github.com/mikestaub)                                              |                                             [Bilal-S](https://github.com/Bilal-S)                                             |                                             [dl748](https://github.com/dl748)                                              |                                             [frsechet](https://github.com/frsechet)                                              |                                             [zoellner](https://github.com/zoellner)                                              |

| [<img alt="johncmckim" src="https://avatars2.githubusercontent.com/u/1297227?v=4&s=117" width="117">](https://github.com/johncmckim) | [<img alt="ThisIsNoZaku" src="https://avatars1.githubusercontent.com/u/4680766?v=4&s=117" width="117">](https://github.com/ThisIsNoZaku) | [<img alt="darthtrevino" src="https://avatars0.githubusercontent.com/u/113544?v=4&s=117" width="117">](https://github.com/darthtrevino) | [<img alt="miltador" src="https://avatars3.githubusercontent.com/u/17062283?v=4&s=117" width="117">](https://github.com/miltador) | [<img alt="gertjvr" src="https://avatars0.githubusercontent.com/u/1691062?v=4&s=117" width="117">](https://github.com/gertjvr) |
| :----------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------: |
|                                             [johncmckim](https://github.com/johncmckim)                                              |                                             [ThisIsNoZaku](https://github.com/ThisIsNoZaku)                                              |                                             [darthtrevino](https://github.com/darthtrevino)                                             |                                              [miltador](https://github.com/miltador)                                              |                                             [gertjvr](https://github.com/gertjvr)                                              |

| [<img alt="juanjoDiaz" src="https://avatars0.githubusercontent.com/u/3322485?v=4&s=117" width="117">](https://github.com/juanjoDiaz) | [<img alt="perkyguy" src="https://avatars3.githubusercontent.com/u/4624648?v=4&s=117" width="117">](https://github.com/perkyguy) | [<img alt="jack-seek" src="https://avatars1.githubusercontent.com/u/19676584?v=4&s=117" width="117">](https://github.com/jack-seek) | [<img alt="hueniverse" src="https://avatars2.githubusercontent.com/u/56631?v=4&s=117" width="117">](https://github.com/hueniverse) | [<img alt="robbtraister" src="https://avatars3.githubusercontent.com/u/5815296?v=4&s=117" width="117">](https://github.com/robbtraister) |
| :----------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------: |
|                                             [juanjoDiaz](https://github.com/juanjoDiaz)                                              |                                             [perkyguy](https://github.com/perkyguy)                                              |                                              [jack-seek](https://github.com/jack-seek)                                              |                                            [hueniverse](https://github.com/hueniverse)                                             |                                             [robbtraister](https://github.com/robbtraister)                                              |

| [<img alt="dortega3000" src="https://avatars1.githubusercontent.com/u/6676525?v=4&s=117" width="117">](https://github.com/dortega3000) | [<img alt="ansraliant" src="https://avatars1.githubusercontent.com/u/7121475?v=4&s=117" width="117">](https://github.com/ansraliant) | [<img alt="joubertredrat" src="https://avatars2.githubusercontent.com/u/1520407?v=4&s=117" width="117">](https://github.com/joubertredrat) | [<img alt="andreipopovici" src="https://avatars0.githubusercontent.com/u/1143417?v=4&s=117" width="117">](https://github.com/andreipopovici) | [<img alt="Andorbal" src="https://avatars1.githubusercontent.com/u/579839?v=4&s=117" width="117">](https://github.com/Andorbal) |
| :------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------: |
|                                             [dortega3000](https://github.com/dortega3000)                                              |                                             [ansraliant](https://github.com/ansraliant)                                              |                                             [joubertredrat](https://github.com/joubertredrat)                                              |                                             [andreipopovici](https://github.com/andreipopovici)                                              |                                             [Andorbal](https://github.com/Andorbal)                                             |

| [<img alt="AyushG3112" src="https://avatars0.githubusercontent.com/u/21307931?v=4&s=117" width="117">](https://github.com/AyushG3112) | [<img alt="franciscocpg" src="https://avatars1.githubusercontent.com/u/3680556?v=4&s=117" width="117">](https://github.com/franciscocpg) | [<img alt="kajwiklund" src="https://avatars2.githubusercontent.com/u/6842806?v=4&s=117" width="117">](https://github.com/kajwiklund) | [<img alt="ondrowan" src="https://avatars2.githubusercontent.com/u/423776?v=4&s=117" width="117">](https://github.com/ondrowan) | [<img alt="sulaysumaria" src="https://avatars3.githubusercontent.com/u/20580362?v=4&s=117" width="117">](https://github.com/sulaysumaria) |
| :-----------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------: |
|                                              [AyushG3112](https://github.com/AyushG3112)                                              |                                             [franciscocpg](https://github.com/franciscocpg)                                              |                                             [kajwiklund](https://github.com/kajwiklund)                                              |                                             [ondrowan](https://github.com/ondrowan)                                             |                                              [sulaysumaria](https://github.com/sulaysumaria)                                              |

| [<img alt="jormaechea" src="https://avatars3.githubusercontent.com/u/5612500?v=4&s=117" width="117">](https://github.com/jormaechea) | [<img alt="awwong1" src="https://avatars0.githubusercontent.com/u/2760111?v=4&s=117" width="117">](https://github.com/awwong1) | [<img alt="c24w" src="https://avatars2.githubusercontent.com/u/710406?v=4&s=117" width="117">](https://github.com/c24w) | [<img alt="vmadman" src="https://avatars1.githubusercontent.com/u/1026490?v=4&s=117" width="117">](https://github.com/vmadman) | [<img alt="encounter" src="https://avatars3.githubusercontent.com/u/549122?v=4&s=117" width="117">](https://github.com/encounter) |
| :----------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: |
|                                             [jormaechea](https://github.com/jormaechea)                                              |                                             [awwong1](https://github.com/awwong1)                                              |                                             [c24w](https://github.com/c24w)                                             |                                             [vmadman](https://github.com/vmadman)                                              |                                             [encounter](https://github.com/encounter)                                             |

| [<img alt="Bob-Thomas" src="https://avatars3.githubusercontent.com/u/2785213?v=4&s=117" width="117">](https://github.com/Bob-Thomas) | [<img alt="njriordan" src="https://avatars2.githubusercontent.com/u/11200170?v=4&s=117" width="117">](https://github.com/njriordan) | [<img alt="bebbi" src="https://avatars0.githubusercontent.com/u/2752391?v=4&s=117" width="117">](https://github.com/bebbi) | [<img alt="trevor-leach" src="https://avatars0.githubusercontent.com/u/39206334?v=4&s=117" width="117">](https://github.com/trevor-leach) | [<img alt="emmoistner" src="https://avatars2.githubusercontent.com/u/5419727?v=4&s=117" width="117">](https://github.com/emmoistner) |
| :----------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: |
|                                             [Bob-Thomas](https://github.com/Bob-Thomas)                                              |                                              [njriordan](https://github.com/njriordan)                                              |                                             [bebbi](https://github.com/bebbi)                                              |                                              [trevor-leach](https://github.com/trevor-leach)                                              |                                             [emmoistner](https://github.com/emmoistner)                                              |

| [<img alt="OrKoN" src="https://avatars3.githubusercontent.com/u/399150?v=4&s=117" width="117">](https://github.com/OrKoN) | [<img alt="adieuadieu" src="https://avatars1.githubusercontent.com/u/438848?v=4&s=117" width="117">](https://github.com/adieuadieu) | [<img alt="apalumbo" src="https://avatars0.githubusercontent.com/u/1729784?v=4&s=117" width="117">](https://github.com/apalumbo) | [<img alt="anishkny" src="https://avatars0.githubusercontent.com/u/357499?v=4&s=117" width="117">](https://github.com/anishkny) | [<img alt="cameroncooper" src="https://avatars3.githubusercontent.com/u/898689?v=4&s=117" width="117">](https://github.com/cameroncooper) |
| :-----------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------: |
|                                             [OrKoN](https://github.com/OrKoN)                                             |                                             [adieuadieu](https://github.com/adieuadieu)                                             |                                             [apalumbo](https://github.com/apalumbo)                                              |                                             [anishkny](https://github.com/anishkny)                                             |                                             [cameroncooper](https://github.com/cameroncooper)                                             |

| [<img alt="cmuto09" src="https://avatars3.githubusercontent.com/u/4679612?v=4&s=117" width="117">](https://github.com/cmuto09) | [<img alt="dschep" src="https://avatars0.githubusercontent.com/u/667763?v=4&s=117" width="117">](https://github.com/dschep) | [<img alt="DimaDK24" src="https://avatars1.githubusercontent.com/u/25607790?v=4&s=117" width="117">](https://github.com/DimaDK24) | [<img alt="dwbelliston" src="https://avatars2.githubusercontent.com/u/11450118?v=4&s=117" width="117">](https://github.com/dwbelliston) | [<img alt="eabadjiev" src="https://avatars0.githubusercontent.com/u/934059?v=4&s=117" width="117">](https://github.com/eabadjiev) |
| :----------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: |
|                                             [cmuto09](https://github.com/cmuto09)                                              |                                             [dschep](https://github.com/dschep)                                             |                                              [DimaDK24](https://github.com/DimaDK24)                                              |                                              [dwbelliston](https://github.com/dwbelliston)                                              |                                             [eabadjiev](https://github.com/eabadjiev)                                             |

| [<img alt="Arkfille" src="https://avatars2.githubusercontent.com/u/19840740?v=4&s=117" width="117">](https://github.com/Arkfille) | [<img alt="garunski" src="https://avatars0.githubusercontent.com/u/1002770?v=4&s=117" width="117">](https://github.com/garunski) | [<img alt="james-relyea" src="https://avatars0.githubusercontent.com/u/1944491?v=4&s=117" width="117">](https://github.com/james-relyea) | [<img alt="joewestcott" src="https://avatars0.githubusercontent.com/u/11187741?v=4&s=117" width="117">](https://github.com/joewestcott) | [<img alt="LoganArnett" src="https://avatars2.githubusercontent.com/u/8780547?v=4&s=117" width="117">](https://github.com/LoganArnett) |
| :-------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------: |
|                                              [Arkfille](https://github.com/Arkfille)                                              |                                             [garunski](https://github.com/garunski)                                              |                                             [james-relyea](https://github.com/james-relyea)                                              |                                              [joewestcott](https://github.com/joewestcott)                                              |                                             [LoganArnett](https://github.com/LoganArnett)                                              |

| [<img alt="ablythe" src="https://avatars2.githubusercontent.com/u/6164745?v=4&s=117" width="117">](https://github.com/ablythe) | [<img alt="marccampbell" src="https://avatars3.githubusercontent.com/u/173451?v=4&s=117" width="117">](https://github.com/marccampbell) | [<img alt="purefan" src="https://avatars1.githubusercontent.com/u/315880?v=4&s=117" width="117">](https://github.com/purefan) | [<img alt="mzmiric5" src="https://avatars1.githubusercontent.com/u/1480072?v=4&s=117" width="117">](https://github.com/mzmiric5) | [<img alt="paulhbarker" src="https://avatars0.githubusercontent.com/u/7366567?v=4&s=117" width="117">](https://github.com/paulhbarker) |
| :----------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------: |
|                                             [ablythe](https://github.com/ablythe)                                              |                                             [marccampbell](https://github.com/marccampbell)                                             |                                             [purefan](https://github.com/purefan)                                             |                                             [mzmiric5](https://github.com/mzmiric5)                                              |                                             [paulhbarker](https://github.com/paulhbarker)                                              |

| [<img alt="pmuens" src="https://avatars3.githubusercontent.com/u/1606004?v=4&s=117" width="117">](https://github.com/pmuens) | [<img alt="pierreis" src="https://avatars2.githubusercontent.com/u/203973?v=4&s=117" width="117">](https://github.com/pierreis) | [<img alt="ramonEmilio" src="https://avatars2.githubusercontent.com/u/10362370?v=4&s=117" width="117">](https://github.com/ramonEmilio) | [<img alt="rschick" src="https://avatars3.githubusercontent.com/u/423474?v=4&s=117" width="117">](https://github.com/rschick) | [<img alt="selcukcihan" src="https://avatars0.githubusercontent.com/u/7043904?v=4&s=117" width="117">](https://github.com/selcukcihan) |
| :--------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------: |
|                                             [pmuens](https://github.com/pmuens)                                              |                                             [pierreis](https://github.com/pierreis)                                             |                                              [ramonEmilio](https://github.com/ramonEmilio)                                              |                                             [rschick](https://github.com/rschick)                                             |                                             [selcukcihan](https://github.com/selcukcihan)                                              |

| [<img alt="patrickheeney" src="https://avatars3.githubusercontent.com/u/1407228?v=4&s=117" width="117">](https://github.com/patrickheeney) | [<img alt="rma4ok" src="https://avatars1.githubusercontent.com/u/470292?v=4&s=117" width="117">](https://github.com/rma4ok) | [<img alt="clschnei" src="https://avatars3.githubusercontent.com/u/1232625?v=4&s=117" width="117">](https://github.com/clschnei) | [<img alt="djcrabhat" src="https://avatars2.githubusercontent.com/u/803042?v=4&s=117" width="117">](https://github.com/djcrabhat) | [<img alt="adam-nielsen" src="https://avatars0.githubusercontent.com/u/278772?v=4&s=117" width="117">](https://github.com/adam-nielsen) |
| :----------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: |
|                                             [patrickheeney](https://github.com/patrickheeney)                                              |                                             [rma4ok](https://github.com/rma4ok)                                             |                                             [clschnei](https://github.com/clschnei)                                              |                                             [djcrabhat](https://github.com/djcrabhat)                                             |                                             [adam-nielsen](https://github.com/adam-nielsen)                                             |

| [<img alt="adamelliottsweeting" src="https://avatars2.githubusercontent.com/u/8907331?v=4&s=117" width="117">](https://github.com/adamelliottsweeting) | [<img alt="againer" src="https://avatars3.githubusercontent.com/u/509709?v=4&s=117" width="117">](https://github.com/againer) | [<img alt="alebianco-doxee" src="https://avatars0.githubusercontent.com/u/56639478?v=4&s=117" width="117">](https://github.com/alebianco-doxee) | [<img alt="koterpillar" src="https://avatars0.githubusercontent.com/u/140276?v=4&s=117" width="117">](https://github.com/koterpillar) | [<img alt="triptec" src="https://avatars0.githubusercontent.com/u/240159?v=4&s=117" width="117">](https://github.com/triptec) |
| :----------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------: |
|                                             [adamelliottsweeting](https://github.com/adamelliottsweeting)                                              |                                             [againer](https://github.com/againer)                                             |                                              [alebianco-doxee](https://github.com/alebianco-doxee)                                              |                                             [koterpillar](https://github.com/koterpillar)                                             |                                             [triptec](https://github.com/triptec)                                             |

| [<img alt="constb" src="https://avatars3.githubusercontent.com/u/1006766?v=4&s=117" width="117">](https://github.com/constb) | [<img alt="cspotcode" src="https://avatars1.githubusercontent.com/u/376504?v=4&s=117" width="117">](https://github.com/cspotcode) | [<img alt="aliatsis" src="https://avatars3.githubusercontent.com/u/4140524?v=4&s=117" width="117">](https://github.com/aliatsis) | [<img alt="arnas" src="https://avatars3.githubusercontent.com/u/13507001?v=4&s=117" width="117">](https://github.com/arnas) | [<img alt="akaila" src="https://avatars2.githubusercontent.com/u/484181?v=4&s=117" width="117">](https://github.com/akaila) |
| :--------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------: |
|                                             [constb](https://github.com/constb)                                              |                                             [cspotcode](https://github.com/cspotcode)                                             |                                             [aliatsis](https://github.com/aliatsis)                                              |                                              [arnas](https://github.com/arnas)                                              |                                             [akaila](https://github.com/akaila)                                             |

| [<img alt="ac360" src="https://avatars1.githubusercontent.com/u/2752551?v=4&s=117" width="117">](https://github.com/ac360) | [<img alt="austin-payne" src="https://avatars3.githubusercontent.com/u/29075091?v=4&s=117" width="117">](https://github.com/austin-payne) | [<img alt="bencooling" src="https://avatars3.githubusercontent.com/u/718994?v=4&s=117" width="117">](https://github.com/bencooling) | [<img alt="BorjaMacedo" src="https://avatars1.githubusercontent.com/u/16381759?v=4&s=117" width="117">](https://github.com/BorjaMacedo) | [<img alt="BrandonE" src="https://avatars1.githubusercontent.com/u/542245?v=4&s=117" width="117">](https://github.com/BrandonE) |
| :------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------: |
|                                             [ac360](https://github.com/ac360)                                              |                                              [austin-payne](https://github.com/austin-payne)                                              |                                             [bencooling](https://github.com/bencooling)                                             |                                              [BorjaMacedo](https://github.com/BorjaMacedo)                                              |                                             [BrandonE](https://github.com/BrandonE)                                             |

| [<img alt="guerrerocarlos" src="https://avatars2.githubusercontent.com/u/82532?v=4&s=117" width="117">](https://github.com/guerrerocarlos) | [<img alt="chrismcleod" src="https://avatars1.githubusercontent.com/u/1134683?v=4&s=117" width="117">](https://github.com/chrismcleod) | [<img alt="christophgysin" src="https://avatars0.githubusercontent.com/u/527924?v=4&s=117" width="117">](https://github.com/christophgysin) | [<img alt="Clement134" src="https://avatars2.githubusercontent.com/u/6473775?v=4&s=117" width="117">](https://github.com/Clement134) | [<img alt="rlgod" src="https://avatars2.githubusercontent.com/u/1705096?v=4&s=117" width="117">](https://github.com/rlgod) |
| :----------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------: |
|                                            [guerrerocarlos](https://github.com/guerrerocarlos)                                             |                                             [chrismcleod](https://github.com/chrismcleod)                                              |                                             [christophgysin](https://github.com/christophgysin)                                             |                                             [Clement134](https://github.com/Clement134)                                              |                                             [rlgod](https://github.com/rlgod)                                              |

| [<img alt="dbunker" src="https://avatars1.githubusercontent.com/u/751580?v=4&s=117" width="117">](https://github.com/dbunker) | [<img alt="dobrynin" src="https://avatars3.githubusercontent.com/u/12061016?v=4&s=117" width="117">](https://github.com/dobrynin) | [<img alt="domaslasauskas" src="https://avatars2.githubusercontent.com/u/2464675?v=4&s=117" width="117">](https://github.com/domaslasauskas) | [<img alt="enolan" src="https://avatars0.githubusercontent.com/u/61517?v=4&s=117" width="117">](https://github.com/enolan) | [<img alt="minibikini" src="https://avatars3.githubusercontent.com/u/439309?v=4&s=117" width="117">](https://github.com/minibikini) |
| :---------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------: |
|                                             [dbunker](https://github.com/dbunker)                                             |                                              [dobrynin](https://github.com/dobrynin)                                              |                                             [domaslasauskas](https://github.com/domaslasauskas)                                              |                                            [enolan](https://github.com/enolan)                                             |                                             [minibikini](https://github.com/minibikini)                                             |

| [<img alt="em0ney" src="https://avatars0.githubusercontent.com/u/5679658?v=4&s=117" width="117">](https://github.com/em0ney) | [<img alt="erauer" src="https://avatars0.githubusercontent.com/u/792171?v=4&s=117" width="117">](https://github.com/erauer) | [<img alt="gbroques" src="https://avatars0.githubusercontent.com/u/12969835?v=4&s=117" width="117">](https://github.com/gbroques) | [<img alt="guillaume" src="https://avatars1.githubusercontent.com/u/368?v=4&s=117" width="117">](https://github.com/guillaume) | [<img alt="balassy" src="https://avatars1.githubusercontent.com/u/1872777?v=4&s=117" width="117">](https://github.com/balassy) |
| :--------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------: |
|                                             [em0ney](https://github.com/em0ney)                                              |                                             [erauer](https://github.com/erauer)                                             |                                              [gbroques](https://github.com/gbroques)                                              |                                           [guillaume](https://github.com/guillaume)                                            |                                             [balassy](https://github.com/balassy)                                              |

| [<img alt="idmontie" src="https://avatars3.githubusercontent.com/u/412382?v=4&s=117" width="117">](https://github.com/idmontie) | [<img alt="jacintoArias" src="https://avatars0.githubusercontent.com/u/7511199?v=4&s=117" width="117">](https://github.com/jacintoArias) | [<img alt="jgrigg" src="https://avatars1.githubusercontent.com/u/12800024?v=4&s=117" width="117">](https://github.com/jgrigg) | [<img alt="jsnajdr" src="https://avatars3.githubusercontent.com/u/664258?v=4&s=117" width="117">](https://github.com/jsnajdr) | [<img alt="horyd" src="https://avatars3.githubusercontent.com/u/916414?v=4&s=117" width="117">](https://github.com/horyd) |
| :-----------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------: |
|                                             [idmontie](https://github.com/idmontie)                                             |                                             [jacintoArias](https://github.com/jacintoArias)                                              |                                              [jgrigg](https://github.com/jgrigg)                                              |                                             [jsnajdr](https://github.com/jsnajdr)                                             |                                             [horyd](https://github.com/horyd)                                             |

| [<img alt="jaydp17" src="https://avatars1.githubusercontent.com/u/1743425?v=4&s=117" width="117">](https://github.com/jaydp17) | [<img alt="jeremygiberson" src="https://avatars2.githubusercontent.com/u/487411?v=4&s=117" width="117">](https://github.com/jeremygiberson) | [<img alt="josephwarrick" src="https://avatars2.githubusercontent.com/u/5392984?v=4&s=117" width="117">](https://github.com/josephwarrick) | [<img alt="jlsjonas" src="https://avatars1.githubusercontent.com/u/932193?v=4&s=117" width="117">](https://github.com/jlsjonas) | [<img alt="joostfarla" src="https://avatars0.githubusercontent.com/u/851863?v=4&s=117" width="117">](https://github.com/joostfarla) |
| :----------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------: |
|                                             [jaydp17](https://github.com/jaydp17)                                              |                                             [jeremygiberson](https://github.com/jeremygiberson)                                             |                                             [josephwarrick](https://github.com/josephwarrick)                                              |                                             [jlsjonas](https://github.com/jlsjonas)                                             |                                             [joostfarla](https://github.com/joostfarla)                                             |

| [<img alt="kenleytomlin" src="https://avatars3.githubusercontent.com/u/3004590?v=4&s=117" width="117">](https://github.com/kenleytomlin) | [<img alt="lalifraco-devspark" src="https://avatars1.githubusercontent.com/u/13339324?v=4&s=117" width="117">](https://github.com/lalifraco-devspark) | [<img alt="DynamicSTOP" src="https://avatars0.githubusercontent.com/u/9434504?v=4&s=117" width="117">](https://github.com/DynamicSTOP) | [<img alt="medikoo" src="https://avatars3.githubusercontent.com/u/122434?v=4&s=117" width="117">](https://github.com/medikoo) | [<img alt="neverendingqs" src="https://avatars1.githubusercontent.com/u/8854618?v=4&s=117" width="117">](https://github.com/neverendingqs) |
| :--------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------: |
|                                             [kenleytomlin](https://github.com/kenleytomlin)                                              |                                              [lalifraco-devspark](https://github.com/lalifraco-devspark)                                              |                                             [DynamicSTOP](https://github.com/DynamicSTOP)                                              |                                             [medikoo](https://github.com/medikoo)                                             |                                             [neverendingqs](https://github.com/neverendingqs)                                              |

| [<img alt="msjonker" src="https://avatars3.githubusercontent.com/u/781683?v=4&s=117" width="117">](https://github.com/msjonker) | [<img alt="Takeno" src="https://avatars0.githubusercontent.com/u/1499063?v=4&s=117" width="117">](https://github.com/Takeno) | [<img alt="mjmac" src="https://avatars1.githubusercontent.com/u/83737?v=4&s=117" width="117">](https://github.com/mjmac) | [<img alt="ojongerius" src="https://avatars0.githubusercontent.com/u/1726055?v=4&s=117" width="117">](https://github.com/ojongerius) | [<img alt="thepont" src="https://avatars1.githubusercontent.com/u/2901992?v=4&s=117" width="117">](https://github.com/thepont) |
| :-----------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------: |
|                                             [msjonker](https://github.com/msjonker)                                             |                                             [Takeno](https://github.com/Takeno)                                              |                                            [mjmac](https://github.com/mjmac)                                             |                                             [ojongerius](https://github.com/ojongerius)                                              |                                             [thepont](https://github.com/thepont)                                              |

| [<img alt="WooDzu" src="https://avatars3.githubusercontent.com/u/2228236?v=4&s=117" width="117">](https://github.com/WooDzu) | [<img alt="PsychicCat" src="https://avatars3.githubusercontent.com/u/4073856?v=4&s=117" width="117">](https://github.com/PsychicCat) | [<img alt="Raph22" src="https://avatars0.githubusercontent.com/u/18127594?v=4&s=117" width="117">](https://github.com/Raph22) | [<img alt="wwsno" src="https://avatars0.githubusercontent.com/u/6328924?v=4&s=117" width="117">](https://github.com/wwsno) | [<img alt="gribnoysup" src="https://avatars2.githubusercontent.com/u/5036933?v=4&s=117" width="117">](https://github.com/gribnoysup) |
| :--------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: |
|                                             [WooDzu](https://github.com/WooDzu)                                              |                                             [PsychicCat](https://github.com/PsychicCat)                                              |                                              [Raph22](https://github.com/Raph22)                                              |                                             [wwsno](https://github.com/wwsno)                                              |                                             [gribnoysup](https://github.com/gribnoysup)                                              |

| [<img alt="starsprung" src="https://avatars3.githubusercontent.com/u/48957?v=4&s=117" width="117">](https://github.com/starsprung) | [<img alt="shineli-not-used-anymore" src="https://avatars3.githubusercontent.com/u/1043331?v=4&s=117" width="117">](https://github.com/shineli-not-used-anymore) | [<img alt="stesie" src="https://avatars1.githubusercontent.com/u/113068?v=4&s=117" width="117">](https://github.com/stesie) | [<img alt="stevemao" src="https://avatars0.githubusercontent.com/u/6316590?v=4&s=117" width="117">](https://github.com/stevemao) | [<img alt="ittus" src="https://avatars3.githubusercontent.com/u/5120965?v=4&s=117" width="117">](https://github.com/ittus) |
| :--------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------: |
|                                            [starsprung](https://github.com/starsprung)                                             |                                             [shineli-not-used-anymore](https://github.com/shineli-not-used-anymore)                                              |                                             [stesie](https://github.com/stesie)                                             |                                             [stevemao](https://github.com/stevemao)                                              |                                             [ittus](https://github.com/ittus)                                              |

| [<img alt="tiagogoncalves89" src="https://avatars2.githubusercontent.com/u/55122?v=4&s=117" width="117">](https://github.com/tiagogoncalves89) | [<img alt="tuanmh" src="https://avatars2.githubusercontent.com/u/3193353?v=4&s=117" width="117">](https://github.com/tuanmh) | [<img alt="Gregoirevda" src="https://avatars3.githubusercontent.com/u/12223738?v=4&s=117" width="117">](https://github.com/Gregoirevda) | [<img alt="gcphost" src="https://avatars3.githubusercontent.com/u/1173636?v=4&s=117" width="117">](https://github.com/gcphost) | [<img alt="YaroslavApatiev" src="https://avatars0.githubusercontent.com/u/24372409?v=4&s=117" width="117">](https://github.com/YaroslavApatiev) |
| :--------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------: |
|                                            [tiagogoncalves89](https://github.com/tiagogoncalves89)                                             |                                             [tuanmh](https://github.com/tuanmh)                                              |                                              [Gregoirevda](https://github.com/Gregoirevda)                                              |                                             [gcphost](https://github.com/gcphost)                                              |                                              [YaroslavApatiev](https://github.com/YaroslavApatiev)                                              |

| [<img alt="zacacollier" src="https://avatars2.githubusercontent.com/u/18710669?v=4&s=117" width="117">](https://github.com/zacacollier) | [<img alt="allenhartwig" src="https://avatars2.githubusercontent.com/u/1261521?v=4&s=117" width="117">](https://github.com/allenhartwig) | [<img alt="demetriusnunes" src="https://avatars0.githubusercontent.com/u/4699?v=4&s=117" width="117">](https://github.com/demetriusnunes) | [<img alt="hsz" src="https://avatars3.githubusercontent.com/u/108333?v=4&s=117" width="117">](https://github.com/hsz) | [<img alt="electrikdevelopment" src="https://avatars3.githubusercontent.com/u/14976795?v=4&s=117" width="117">](https://github.com/electrikdevelopment) |
| :-------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                              [zacacollier](https://github.com/zacacollier)                                              |                                             [allenhartwig](https://github.com/allenhartwig)                                              |                                            [demetriusnunes](https://github.com/demetriusnunes)                                            |                                             [hsz](https://github.com/hsz)                                             |                                              [electrikdevelopment](https://github.com/electrikdevelopment)                                              |

| [<img alt="jgilbert01" src="https://avatars1.githubusercontent.com/u/1082126?v=4&s=117" width="117">](https://github.com/jgilbert01) | [<img alt="polaris340" src="https://avatars2.githubusercontent.com/u/2861192?v=4&s=117" width="117">](https://github.com/polaris340) | [<img alt="kobanyan" src="https://avatars0.githubusercontent.com/u/14950314?v=4&s=117" width="117">](https://github.com/kobanyan) | [<img alt="leruitga-ss" src="https://avatars1.githubusercontent.com/u/39830392?v=4&s=117" width="117">](https://github.com/leruitga-ss) | [<img alt="livingmine" src="https://avatars1.githubusercontent.com/u/7286614?v=4&s=117" width="117">](https://github.com/livingmine) |
| :----------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: |
|                                             [jgilbert01](https://github.com/jgilbert01)                                              |                                             [polaris340](https://github.com/polaris340)                                              |                                              [kobanyan](https://github.com/kobanyan)                                              |                                              [leruitga-ss](https://github.com/leruitga-ss)                                              |                                             [livingmine](https://github.com/livingmine)                                              |

| [<img alt="lteacher" src="https://avatars3.githubusercontent.com/u/6103860?v=4&s=117" width="117">](https://github.com/lteacher) | [<img alt="martinmicunda" src="https://avatars1.githubusercontent.com/u/1643606?v=4&s=117" width="117">](https://github.com/martinmicunda) | [<img alt="nori3tsu" src="https://avatars0.githubusercontent.com/u/379587?v=4&s=117" width="117">](https://github.com/nori3tsu) | [<img alt="ppasmanik" src="https://avatars0.githubusercontent.com/u/3534835?v=4&s=117" width="117">](https://github.com/ppasmanik) | [<img alt="ryanzyy" src="https://avatars1.githubusercontent.com/u/2299226?v=4&s=117" width="117">](https://github.com/ryanzyy) |
| :------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------: |
|                                             [lteacher](https://github.com/lteacher)                                              |                                             [martinmicunda](https://github.com/martinmicunda)                                              |                                             [nori3tsu](https://github.com/nori3tsu)                                             |                                             [ppasmanik](https://github.com/ppasmanik)                                              |                                             [ryanzyy](https://github.com/ryanzyy)                                              |

| [<img alt="m0ppers" src="https://avatars3.githubusercontent.com/u/819421?v=4&s=117" width="117">](https://github.com/m0ppers) | [<img alt="footballencarta" src="https://avatars0.githubusercontent.com/u/1312258?v=4&s=117" width="117">](https://github.com/footballencarta) | [<img alt="bryanvaz" src="https://avatars0.githubusercontent.com/u/9157498?v=4&s=117" width="117">](https://github.com/bryanvaz) | [<img alt="njyjn" src="https://avatars.githubusercontent.com/u/10694375?v=4&s=117" width="117">](https://github.com/njyjn) | [<img alt="kdybicz" src="https://avatars.githubusercontent.com/u/13134892?v=4" width="117">](https://github.com/kdybicz) |
| :---------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------ |
|                                             [m0ppers](https://github.com/m0ppers)                                             |                                             [footballencarta](https://github.com/footballencarta)                                              |                                             [bryanvaz](https://github.com/bryanvaz)                                              |                                             [njyjn](https://github.com/njyjn)                                              | [kdybicz](https://github.com/kdybicz)                                                                                    |

| [<img alt="ericctsf" src="https://avatars.githubusercontent.com/u/42775388?v=4" width="117">](https://github.com/ericctsf) | [<img alt="brazilianbytes" src="https://avatars.githubusercontent.com/u/1900570?v=4" width="117">](https://github.com/brazilianbytes) |
| :------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------: |
|                                           [ericctsf](https://github.com/erictsf)                                           |                                          [brazilianbytes](https://github.com/brazilianbytes)                                          |
