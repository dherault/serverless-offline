# Serverless Offline

<div align="center">
  <p>
    <sup>
      <a href="https://github.com/sponsors/dherault">Serverless-offline is supported by the community.</a>
    </sup>
  </p>
  <sup>
    Special thanks to:
  </sup>
  <a href="https://airfriend.app?ref=so">
    <div>
      <img src="https://airfriend.app/images/logotype.png" height="64" alt="Airfriend">
    </div>
    <b>
      An AI friend on WhatsApp.
    </b>
  </a>
  <a href="https://arccode.dev?ref=so">
    <div>
      <img src="https://arccode.dev/images/logotype.png" height="64" alt="Arccode">
    </div>
    <b>
      The first role-playing game for developers
    </b>
    <div>
      XP, level ups and guilds. All while you work.
    </div>
  </a>
</div>
&nbsp;
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

#### noSponsor

Remove sponsor message from the output.

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

#### preLoadModules

Pre-load specified modules in the main thread to avoid crashes when importing in worker threads. Provide module names as a comma-separated list (e.g., "sharp,canvas").<br />
Default: ''

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
import { env } from "node:process"
import aws from "aws-sdk"

const lambda = new aws.Lambda({
  apiVersion: "2015-03-31",
  // endpoint needs to be set only if it deviates from the default
  endpoint: env.IS_OFFLINE
    ? "http://localhost:3002"
    : "https://lambda.us-east-1.amazonaws.com",
})
```

All your lambdas can then be invoked in a handler using

```js
import { Buffer } from "node:buffer"
import aws from "aws-sdk"

const { stringify } = JSON

const lambda = new aws.Lambda({
  apiVersion: "2015-03-31",
  endpoint: "http://localhost:3002",
})

export async function handler() {
  const clientContextData = stringify({
    foo: "foo",
  })

  const payload = stringify({
    data: "foo",
  })

  const params = {
    ClientContext: Buffer.from(clientContextData).toString("base64"),
    // FunctionName is composed of: service name - stage - function name, e.g.
    FunctionName: "myServiceName-dev-invokedHandler",
    InvocationType: "RequestResponse",
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

    name: "your strategy name",
    scheme: "your scheme name",
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
        Uri: "http://localhost:3001/assets/{proxy}"
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
  - serverless-dynamodb # adds a local dynamo db
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

[<img alt="dnalborczyk" src="https://avatars.githubusercontent.com/u/2903325?v=4&s=117" width="117">](https://github.com/dnalborczyk)[<img alt="dherault" src="https://avatars.githubusercontent.com/u/4154003?v=4&s=117" width="117">](https://github.com/dherault)[<img alt="computerpunc" src="https://avatars.githubusercontent.com/u/721008?v=4&s=117" width="117">](https://github.com/computerpunc)[<img alt="frozenbonito" src="https://avatars.githubusercontent.com/u/26363256?v=4&s=117" width="117">](https://github.com/frozenbonito)[<img alt="leonardoalifraco" src="https://avatars.githubusercontent.com/u/2942943?v=4&s=117" width="117">](https://github.com/leonardoalifraco)[<img alt="medikoo" src="https://avatars.githubusercontent.com/u/122434?v=4&s=117" width="117">](https://github.com/medikoo)

[<img alt="apancutt" src="https://avatars.githubusercontent.com/u/1040525?v=4&s=117" width="117">](https://github.com/apancutt)[<img alt="chardos" src="https://avatars.githubusercontent.com/u/4082442?v=4&s=117" width="117">](https://github.com/chardos)[<img alt="daniel-cottone" src="https://avatars.githubusercontent.com/u/26556340?v=4&s=117" width="117">](https://github.com/daniel-cottone)[<img alt="DorianMazur" src="https://avatars.githubusercontent.com/u/46839236?v=4&s=117" width="117">](https://github.com/DorianMazur)[<img alt="bryantbiggs" src="https://avatars.githubusercontent.com/u/10913471?v=4&s=117" width="117">](https://github.com/bryantbiggs)[<img alt="pgrzesik" src="https://avatars.githubusercontent.com/u/17499590?v=4&s=117" width="117">](https://github.com/pgrzesik)

[<img alt="mikestaub" src="https://avatars.githubusercontent.com/u/1254558?v=4&s=117" width="117">](https://github.com/mikestaub)[<img alt="Bilal-S" src="https://avatars.githubusercontent.com/u/668901?v=4&s=117" width="117">](https://github.com/Bilal-S)[<img alt="juanjoDiaz" src="https://avatars.githubusercontent.com/u/3322485?v=4&s=117" width="117">](https://github.com/juanjoDiaz)[<img alt="zoellner" src="https://avatars.githubusercontent.com/u/2665319?v=4&s=117" width="117">](https://github.com/zoellner)[<img alt="frsechet" src="https://avatars.githubusercontent.com/u/7351940?v=4&s=117" width="117">](https://github.com/frsechet)[<img alt="johncmckim" src="https://avatars.githubusercontent.com/u/1297227?v=4&s=117" width="117">](https://github.com/johncmckim)

[<img alt="dl748" src="https://avatars.githubusercontent.com/u/4815868?v=4&s=117" width="117">](https://github.com/dl748)[<img alt="ThisIsNoZaku" src="https://avatars.githubusercontent.com/u/4680766?v=4&s=117" width="117">](https://github.com/ThisIsNoZaku)[<img alt="darthtrevino" src="https://avatars.githubusercontent.com/u/113544?v=4&s=117" width="117">](https://github.com/darthtrevino)[<img alt="NicolasSeiler" src="https://avatars.githubusercontent.com/u/31805224?v=4&s=117" width="117">](https://github.com/NicolasSeiler)[<img alt="miltador" src="https://avatars.githubusercontent.com/u/17062283?v=4&s=117" width="117">](https://github.com/miltador)[<img alt="moroine" src="https://avatars.githubusercontent.com/u/4658821?v=4&s=117" width="117">](https://github.com/moroine)

[<img alt="gertjvr" src="https://avatars.githubusercontent.com/u/1691062?v=4&s=117" width="117">](https://github.com/gertjvr)[<img alt="bytekast" src="https://avatars.githubusercontent.com/u/241901?v=4&s=117" width="117">](https://github.com/bytekast)[<img alt="jormaechea" src="https://avatars.githubusercontent.com/u/5612500?v=4&s=117" width="117">](https://github.com/jormaechea)[<img alt="thomaschaaf" src="https://avatars.githubusercontent.com/u/893393?v=4&s=117" width="117">](https://github.com/thomaschaaf)[<img alt="dortega3000" src="https://avatars.githubusercontent.com/u/6676525?v=4&s=117" width="117">](https://github.com/dortega3000)[<img alt="tom-marsh" src="https://avatars.githubusercontent.com/u/18220186?v=4&s=117" width="117">](https://github.com/tom-marsh)

[<img alt="rwynn" src="https://avatars.githubusercontent.com/u/260672?v=4&s=117" width="117">](https://github.com/rwynn)[<img alt="robbtraister" src="https://avatars.githubusercontent.com/u/5815296?v=4&s=117" width="117">](https://github.com/robbtraister)[<img alt="joubertredrat" src="https://avatars.githubusercontent.com/u/1520407?v=4&s=117" width="117">](https://github.com/joubertredrat)[<img alt="jack-seek" src="https://avatars.githubusercontent.com/u/19676584?v=4&s=117" width="117">](https://github.com/jack-seek)[<img alt="perkyguy" src="https://avatars.githubusercontent.com/u/4624648?v=4&s=117" width="117">](https://github.com/perkyguy)[<img alt="ansraliant" src="https://avatars.githubusercontent.com/u/7121475?v=4&s=117" width="117">](https://github.com/ansraliant)

[<img alt="hueniverse" src="https://avatars.githubusercontent.com/u/56631?v=4&s=117" width="117">](https://github.com/hueniverse)[<img alt="james-relyea" src="https://avatars.githubusercontent.com/u/1944491?v=4&s=117" width="117">](https://github.com/james-relyea)[<img alt="sulaysumaria" src="https://avatars.githubusercontent.com/u/174357920?v=4&s=117" width="117">](https://github.com/sulaysumaria)[<img alt="ondrowan" src="https://avatars.githubusercontent.com/u/423776?v=4&s=117" width="117">](https://github.com/ondrowan)[<img alt="franciscocpg" src="https://avatars.githubusercontent.com/u/3680556?v=4&s=117" width="117">](https://github.com/franciscocpg)[<img alt="AyushG3112" src="https://avatars.githubusercontent.com/u/21307931?v=4&s=117" width="117">](https://github.com/AyushG3112)

[<img alt="Andorbal" src="https://avatars.githubusercontent.com/u/579839?v=4&s=117" width="117">](https://github.com/Andorbal)[<img alt="AlexHayton" src="https://avatars.githubusercontent.com/u/63102?v=4&s=117" width="117">](https://github.com/AlexHayton)[<img alt="andreipopovici" src="https://avatars.githubusercontent.com/u/1143417?v=4&s=117" width="117">](https://github.com/andreipopovici)[<img alt="awwong1" src="https://avatars.githubusercontent.com/u/2760111?v=4&s=117" width="117">](https://github.com/awwong1)[<img alt="emmoistner" src="https://avatars.githubusercontent.com/u/5419727?v=4&s=117" width="117">](https://github.com/emmoistner)[<img alt="coyoteecd" src="https://avatars.githubusercontent.com/u/47973420?v=4&s=117" width="117">](https://github.com/coyoteecd)

[<img alt="OrKoN" src="https://avatars.githubusercontent.com/u/399150?v=4&s=117" width="117">](https://github.com/OrKoN)[<img alt="trevor-leach" src="https://avatars.githubusercontent.com/u/39206334?v=4&s=117" width="117">](https://github.com/trevor-leach)[<img alt="bebbi" src="https://avatars.githubusercontent.com/u/2752391?v=4&s=117" width="117">](https://github.com/bebbi)[<img alt="paulhbarker" src="https://avatars.githubusercontent.com/u/7366567?v=4&s=117" width="117">](https://github.com/paulhbarker)[<img alt="njriordan" src="https://avatars.githubusercontent.com/u/11200170?v=4&s=117" width="117">](https://github.com/njriordan)[<img alt="adieuadieu" src="https://avatars.githubusercontent.com/u/438848?v=4&s=117" width="117">](https://github.com/adieuadieu)

[<img alt="encounter" src="https://avatars.githubusercontent.com/u/549122?v=4&s=117" width="117">](https://github.com/encounter)[<img alt="leemhenson" src="https://avatars.githubusercontent.com/u/515?v=4&s=117" width="117">](https://github.com/leemhenson)[<img alt="ALOHACREPES345" src="https://avatars.githubusercontent.com/u/51868219?v=4&s=117" width="117">](https://github.com/ALOHACREPES345)[<img alt="Bob-Thomas" src="https://avatars.githubusercontent.com/u/2785213?v=4&s=117" width="117">](https://github.com/Bob-Thomas)[<img alt="c24w" src="https://avatars.githubusercontent.com/u/710406?v=4&s=117" width="117">](https://github.com/c24w)[<img alt="cnuss" src="https://avatars.githubusercontent.com/u/819991?v=4&s=117" width="117">](https://github.com/cnuss)

[<img alt="raySavignone" src="https://avatars.githubusercontent.com/u/10362370?v=4&s=117" width="117">](https://github.com/raySavignone)[<img alt="pierreis" src="https://avatars.githubusercontent.com/u/203973?v=4&s=117" width="117">](https://github.com/pierreis)[<img alt="pmuens" src="https://avatars.githubusercontent.com/u/1606004?v=4&s=117" width="117">](https://github.com/pmuens)[<img alt="mzmiric5" src="https://avatars.githubusercontent.com/u/1480072?v=4&s=117" width="117">](https://github.com/mzmiric5)[<img alt="purefan" src="https://avatars.githubusercontent.com/u/315880?v=4&s=117" width="117">](https://github.com/purefan)[<img alt="matt-peck" src="https://avatars.githubusercontent.com/u/18297252?v=4&s=117" width="117">](https://github.com/matt-peck)

[<img alt="marccampbell" src="https://avatars.githubusercontent.com/u/173451?v=4&s=117" width="117">](https://github.com/marccampbell)[<img alt="djcrabhat" src="https://avatars.githubusercontent.com/u/803042?v=4&s=117" width="117">](https://github.com/djcrabhat)[<img alt="ablythe" src="https://avatars.githubusercontent.com/u/6164745?v=4&s=117" width="117">](https://github.com/ablythe)[<img alt="Rawne" src="https://avatars.githubusercontent.com/u/1477918?v=4&s=117" width="117">](https://github.com/Rawne)[<img alt="selcukcihan" src="https://avatars.githubusercontent.com/u/7043904?v=4&s=117" width="117">](https://github.com/selcukcihan)[<img alt="shalvah" src="https://avatars.githubusercontent.com/u/14361073?v=4&s=117" width="117">](https://github.com/shalvah)

[<img alt="footballencarta" src="https://avatars.githubusercontent.com/u/1312258?v=4&s=117" width="117">](https://github.com/footballencarta)[<img alt="francisu" src="https://avatars.githubusercontent.com/u/944949?v=4&s=117" width="117">](https://github.com/francisu)[<img alt="patrickheeney" src="https://avatars.githubusercontent.com/u/1407228?v=4&s=117" width="117">](https://github.com/patrickheeney)[<img alt="re1ro" src="https://avatars.githubusercontent.com/u/470292?v=4&s=117" width="117">](https://github.com/re1ro)[<img alt="andidev" src="https://avatars.githubusercontent.com/u/571389?v=4&s=117" width="117">](https://github.com/andidev)[<img alt="arnas" src="https://avatars.githubusercontent.com/u/13507001?v=4&s=117" width="117">](https://github.com/arnas)

[<img alt="clschnei" src="https://avatars.githubusercontent.com/u/1232625?v=4&s=117" width="117">](https://github.com/clschnei)[<img alt="d10-cc" src="https://avatars.githubusercontent.com/u/94011455?v=4&s=117" width="117">](https://github.com/d10-cc)[<img alt="pettyalex" src="https://avatars.githubusercontent.com/u/3219141?v=4&s=117" width="117">](https://github.com/pettyalex)[<img alt="domdomegg" src="https://avatars.githubusercontent.com/u/4953590?v=4&s=117" width="117">](https://github.com/domdomegg)[<img alt="apalumbo" src="https://avatars.githubusercontent.com/u/1729784?v=4&s=117" width="117">](https://github.com/apalumbo)[<img alt="rion18" src="https://avatars.githubusercontent.com/u/5338637?v=4&s=117" width="117">](https://github.com/rion18)

[<img alt="anishkny" src="https://avatars.githubusercontent.com/u/357499?v=4&s=117" width="117">](https://github.com/anishkny)[<img alt="cameroncooper" src="https://avatars.githubusercontent.com/u/898689?v=4&s=117" width="117">](https://github.com/cameroncooper)[<img alt="cmuto09" src="https://avatars.githubusercontent.com/u/4679612?v=4&s=117" width="117">](https://github.com/cmuto09)[<img alt="dschep" src="https://avatars.githubusercontent.com/u/667763?v=4&s=117" width="117">](https://github.com/dschep)[<img alt="dimadk24" src="https://avatars.githubusercontent.com/u/25607790?v=4&s=117" width="117">](https://github.com/dimadk24)[<img alt="dwbelliston" src="https://avatars.githubusercontent.com/u/11450118?v=4&s=117" width="117">](https://github.com/dwbelliston)

[<img alt="LoganArnett" src="https://avatars.githubusercontent.com/u/8780547?v=4&s=117" width="117">](https://github.com/LoganArnett)[<img alt="DocLM" src="https://avatars.githubusercontent.com/u/2318483?v=4&s=117" width="117">](https://github.com/DocLM)[<img alt="njyjn" src="https://avatars.githubusercontent.com/u/10694375?v=4&s=117" width="117">](https://github.com/njyjn)[<img alt="perrin4869" src="https://avatars.githubusercontent.com/u/5774716?v=4&s=117" width="117">](https://github.com/perrin4869)[<img alt="joewestcott" src="https://avatars.githubusercontent.com/u/11187741?v=4&s=117" width="117">](https://github.com/joewestcott)[<img alt="jeroenvollenbrock" src="https://avatars.githubusercontent.com/u/4551130?v=4&s=117" width="117">](https://github.com/jeroenvollenbrock)

[<img alt="garunski" src="https://avatars.githubusercontent.com/u/1002770?v=4&s=117" width="117">](https://github.com/garunski)[<img alt="G-Rath" src="https://avatars.githubusercontent.com/u/3151613?v=4&s=117" width="117">](https://github.com/G-Rath)[<img alt="tqfipe" src="https://avatars.githubusercontent.com/u/19840740?v=4&s=117" width="117">](https://github.com/tqfipe)[<img alt="eabadjiev" src="https://avatars.githubusercontent.com/u/934059?v=4&s=117" width="117">](https://github.com/eabadjiev)[<img alt="efrain17" src="https://avatars.githubusercontent.com/u/21026552?v=4&s=117" width="117">](https://github.com/efrain17)[<img alt="thepont" src="https://avatars.githubusercontent.com/u/2901992?v=4&s=117" width="117">](https://github.com/thepont)

[<img alt="petetnt" src="https://avatars.githubusercontent.com/u/7641760?v=4&s=117" width="117">](https://github.com/petetnt)[<img alt="PsychicCat" src="https://avatars.githubusercontent.com/u/4073856?v=4&s=117" width="117">](https://github.com/PsychicCat)[<img alt="randytarampi" src="https://avatars.githubusercontent.com/u/592216?v=4&s=117" width="117">](https://github.com/randytarampi)[<img alt="Raph22" src="https://avatars.githubusercontent.com/u/18127594?v=4&s=117" width="117">](https://github.com/Raph22)[<img alt="juarezjaramillo" src="https://avatars.githubusercontent.com/u/4152822?v=4&s=117" width="117">](https://github.com/juarezjaramillo)[<img alt="uh-zz" src="https://avatars.githubusercontent.com/u/47747828?v=4&s=117" width="117">](https://github.com/uh-zz)

[<img alt="rfranco" src="https://avatars.githubusercontent.com/u/399203?v=4&s=117" width="117">](https://github.com/rfranco)[<img alt="Trott" src="https://avatars.githubusercontent.com/u/718899?v=4&s=117" width="117">](https://github.com/Trott)[<img alt="RichiCoder1" src="https://avatars.githubusercontent.com/u/2391878?v=4&s=117" width="117">](https://github.com/RichiCoder1)[<img alt="rishi8094" src="https://avatars.githubusercontent.com/u/20362222?v=4&s=117" width="117">](https://github.com/rishi8094)[<img alt="rloomans" src="https://avatars.githubusercontent.com/u/92133?v=4&s=117" width="117">](https://github.com/rloomans)[<img alt="roberttaylor426" src="https://avatars.githubusercontent.com/u/535032?v=4&s=117" width="117">](https://github.com/roberttaylor426)

[<img alt="wwsno" src="https://avatars.githubusercontent.com/u/6328924?v=4&s=117" width="117">](https://github.com/wwsno)[<img alt="gribnoysup" src="https://avatars.githubusercontent.com/u/5036933?v=4&s=117" width="117">](https://github.com/gribnoysup)[<img alt="sergiodurand" src="https://avatars.githubusercontent.com/u/19421918?v=4&s=117" width="117">](https://github.com/sergiodurand)[<img alt="sethetter" src="https://avatars.githubusercontent.com/u/655500?v=4&s=117" width="117">](https://github.com/sethetter)[<img alt="shineli-not-used-anymore" src="https://avatars.githubusercontent.com/u/1043331?v=4&s=117" width="117">](https://github.com/shineli-not-used-anymore)[<img alt="ericctsf" src="https://avatars.githubusercontent.com/u/42775388?v=4&s=117" width="117">](https://github.com/ericctsf)

[<img alt="BorjaMacedo" src="https://avatars.githubusercontent.com/u/16381759?v=4&s=117" width="117">](https://github.com/BorjaMacedo)[<img alt="kdybicz" src="https://avatars.githubusercontent.com/u/13134892?v=4&s=117" width="117">](https://github.com/kdybicz)[<img alt="kenleytomlin" src="https://avatars.githubusercontent.com/u/3004590?v=4&s=117" width="117">](https://github.com/kenleytomlin)[<img alt="kevinhankens" src="https://avatars.githubusercontent.com/u/679364?v=4&s=117" width="117">](https://github.com/kevinhankens)[<img alt="kerueter" src="https://avatars.githubusercontent.com/u/16644743?v=4&s=117" width="117">](https://github.com/kerueter)[<img alt="ktwbc" src="https://avatars.githubusercontent.com/u/624611?v=4&s=117" width="117">](https://github.com/ktwbc)

[<img alt="kohanian" src="https://avatars.githubusercontent.com/u/8570821?v=4&s=117" width="117">](https://github.com/kohanian)[<img alt="kyusungpark" src="https://avatars.githubusercontent.com/u/58890841?v=4&s=117" width="117">](https://github.com/kyusungpark)[<img alt="lalifraco-devspark" src="https://avatars.githubusercontent.com/u/13339324?v=4&s=117" width="117">](https://github.com/lalifraco-devspark)[<img alt="DynamicSTOP" src="https://avatars.githubusercontent.com/u/9434504?v=4&s=117" width="117">](https://github.com/DynamicSTOP)[<img alt="brazilianbytes" src="https://avatars.githubusercontent.com/u/1900570?v=4&s=117" width="117">](https://github.com/brazilianbytes)[<img alt="Marcel-G" src="https://avatars.githubusercontent.com/u/2770666?v=4&s=117" width="117">](https://github.com/Marcel-G)

[<img alt="neverendingqs" src="https://avatars.githubusercontent.com/u/8854618?v=4&s=117" width="117">](https://github.com/neverendingqs)[<img alt="msjonker" src="https://avatars.githubusercontent.com/u/781683?v=4&s=117" width="117">](https://github.com/msjonker)[<img alt="Takeno" src="https://avatars.githubusercontent.com/u/1499063?v=4&s=117" width="117">](https://github.com/Takeno)[<img alt="kelchm" src="https://avatars.githubusercontent.com/u/172301?v=4&s=117" width="117">](https://github.com/kelchm)[<img alt="mjmac" src="https://avatars.githubusercontent.com/u/83737?v=4&s=117" width="117">](https://github.com/mjmac)[<img alt="mohokh67" src="https://avatars.githubusercontent.com/u/10816168?v=4&s=117" width="117">](https://github.com/mohokh67)

[<img alt="AlexHladin" src="https://avatars.githubusercontent.com/u/7945837?v=4&s=117" width="117">](https://github.com/AlexHladin)[<img alt="ojongerius" src="https://avatars.githubusercontent.com/u/1726055?v=4&s=117" width="117">](https://github.com/ojongerius)[<img alt="parasgera" src="https://avatars.githubusercontent.com/u/4932306?v=4&s=117" width="117">](https://github.com/parasgera)[<img alt="furipon308" src="https://avatars.githubusercontent.com/u/12597185?v=4&s=117" width="117">](https://github.com/furipon308)[<img alt="hsz" src="https://avatars.githubusercontent.com/u/108333?v=4&s=117" width="117">](https://github.com/hsz)[<img alt="jeffhall4" src="https://avatars.githubusercontent.com/u/14976795?v=4&s=117" width="117">](https://github.com/jeffhall4)

[<img alt="jgilbert01" src="https://avatars.githubusercontent.com/u/1082126?v=4&s=117" width="117">](https://github.com/jgilbert01)[<img alt="polaris340" src="https://avatars.githubusercontent.com/u/2861192?v=4&s=117" width="117">](https://github.com/polaris340)[<img alt="khanguyen88" src="https://avatars.githubusercontent.com/u/26890183?v=4&s=117" width="117">](https://github.com/khanguyen88)[<img alt="kobanyan" src="https://avatars.githubusercontent.com/u/14950314?v=4&s=117" width="117">](https://github.com/kobanyan)[<img alt="livingmine" src="https://avatars.githubusercontent.com/u/7286614?v=4&s=117" width="117">](https://github.com/livingmine)[<img alt="lteacher" src="https://avatars.githubusercontent.com/u/6103860?v=4&s=117" width="117">](https://github.com/lteacher)

[<img alt="martinmicunda" src="https://avatars.githubusercontent.com/u/1643606?v=4&s=117" width="117">](https://github.com/martinmicunda)[<img alt="nick-w-nick" src="https://avatars.githubusercontent.com/u/43578531?v=4&s=117" width="117">](https://github.com/nick-w-nick)[<img alt="nori3tsu" src="https://avatars.githubusercontent.com/u/379587?v=4&s=117" width="117">](https://github.com/nori3tsu)[<img alt="ppasmanik" src="https://avatars.githubusercontent.com/u/3534835?v=4&s=117" width="117">](https://github.com/ppasmanik)[<img alt="ryanzyy" src="https://avatars.githubusercontent.com/u/2299226?v=4&s=117" width="117">](https://github.com/ryanzyy)[<img alt="skhrapko-amplify" src="https://avatars.githubusercontent.com/u/103408480?v=4&s=117" width="117">](https://github.com/skhrapko-amplify)

[<img alt="adikari" src="https://avatars.githubusercontent.com/u/1757714?v=4&s=117" width="117">](https://github.com/adikari)[<img alt="tom-stclair" src="https://avatars.githubusercontent.com/u/96192789?v=4&s=117" width="117">](https://github.com/tom-stclair)[<img alt="tveal" src="https://avatars.githubusercontent.com/u/42526035?v=4&s=117" width="117">](https://github.com/tveal)[<img alt="constb" src="https://avatars.githubusercontent.com/u/1006766?v=4&s=117" width="117">](https://github.com/constb)[<img alt="stesie" src="https://avatars.githubusercontent.com/u/113068?v=4&s=117" width="117">](https://github.com/stesie)[<img alt="stevemao" src="https://avatars.githubusercontent.com/u/6316590?v=4&s=117" width="117">](https://github.com/stevemao)

[<img alt="trsrm" src="https://avatars.githubusercontent.com/u/1160872?v=4&s=117" width="117">](https://github.com/trsrm)[<img alt="ittus" src="https://avatars.githubusercontent.com/u/5120965?v=4&s=117" width="117">](https://github.com/ittus)[<img alt="Ankcorn" src="https://avatars.githubusercontent.com/u/7361428?v=4&s=117" width="117">](https://github.com/Ankcorn)[<img alt="expoe-codebuild" src="https://avatars.githubusercontent.com/u/38527465?v=4&s=117" width="117">](https://github.com/expoe-codebuild)[<img alt="tiagogoncalves89" src="https://avatars.githubusercontent.com/u/55122?v=4&s=117" width="117">](https://github.com/tiagogoncalves89)[<img alt="czubocha" src="https://avatars.githubusercontent.com/u/23511767?v=4&s=117" width="117">](https://github.com/czubocha)

[<img alt="tuanmh" src="https://avatars.githubusercontent.com/u/3193353?v=4&s=117" width="117">](https://github.com/tuanmh)[<img alt="Gregoirevda" src="https://avatars.githubusercontent.com/u/12223738?v=4&s=117" width="117">](https://github.com/Gregoirevda)[<img alt="vivganes" src="https://avatars.githubusercontent.com/u/2035886?v=4&s=117" width="117">](https://github.com/vivganes)[<img alt="gcphost" src="https://avatars.githubusercontent.com/u/1173636?v=4&s=117" width="117">](https://github.com/gcphost)[<img alt="YaroslavApatiev" src="https://avatars.githubusercontent.com/u/24372409?v=4&s=117" width="117">](https://github.com/YaroslavApatiev)[<img alt="zacacollier" src="https://avatars.githubusercontent.com/u/18710669?v=4&s=117" width="117">](https://github.com/zacacollier)

[<img alt="akinboboye" src="https://avatars.githubusercontent.com/u/60622084?v=4&s=117" width="117">](https://github.com/akinboboye)[<img alt="allenhartwig" src="https://avatars.githubusercontent.com/u/1261521?v=4&s=117" width="117">](https://github.com/allenhartwig)[<img alt="ctbaird" src="https://avatars.githubusercontent.com/u/37962844?v=4&s=117" width="117">](https://github.com/ctbaird)[<img alt="demetriusnunes" src="https://avatars.githubusercontent.com/u/4699?v=4&s=117" width="117">](https://github.com/demetriusnunes)[<img alt="dependabot[bot]" src="https://avatars.githubusercontent.com/in/29110?v=4&s=117" width="117">](https://github.com/apps/dependabot)[<img alt="drace-rgare" src="https://avatars.githubusercontent.com/u/96196419?v=4&s=117" width="117">](https://github.com/drace-rgare)

[<img alt="BrandonE" src="https://avatars.githubusercontent.com/u/542245?v=4&s=117" width="117">](https://github.com/BrandonE)[<img alt="guerrerocarlos" src="https://avatars.githubusercontent.com/u/82532?v=4&s=117" width="117">](https://github.com/guerrerocarlos)[<img alt="chrismcleod" src="https://avatars.githubusercontent.com/u/1134683?v=4&s=117" width="117">](https://github.com/chrismcleod)[<img alt="icarus-sullivan" src="https://avatars.githubusercontent.com/u/17626168?v=4&s=117" width="117">](https://github.com/icarus-sullivan)[<img alt="christophgysin" src="https://avatars.githubusercontent.com/u/527924?v=4&s=117" width="117">](https://github.com/christophgysin)[<img alt="cdubz" src="https://avatars.githubusercontent.com/u/10456740?v=4&s=117" width="117">](https://github.com/cdubz)

[<img alt="corwinm" src="https://avatars.githubusercontent.com/u/7642548?v=4&s=117" width="117">](https://github.com/corwinm)[<img alt="danmactough" src="https://avatars.githubusercontent.com/u/357481?v=4&s=117" width="117">](https://github.com/danmactough)[<img alt="GeneralistDev" src="https://avatars.githubusercontent.com/u/1705096?v=4&s=117" width="117">](https://github.com/GeneralistDev)[<img alt="designfrontier" src="https://avatars.githubusercontent.com/u/422540?v=4&s=117" width="117">](https://github.com/designfrontier)[<img alt="daniel0707" src="https://avatars.githubusercontent.com/u/22343156?v=4&s=117" width="117">](https://github.com/daniel0707)[<img alt="dnicolson" src="https://avatars.githubusercontent.com/u/2276355?v=4&s=117" width="117">](https://github.com/dnicolson)

[<img alt="dbunker" src="https://avatars.githubusercontent.com/u/751580?v=4&s=117" width="117">](https://github.com/dbunker)[<img alt="dobrynin" src="https://avatars.githubusercontent.com/u/12061016?v=4&s=117" width="117">](https://github.com/dobrynin)[<img alt="DavideSegullo" src="https://avatars.githubusercontent.com/u/17269969?v=4&s=117" width="117">](https://github.com/DavideSegullo)[<img alt="domaslasauskas" src="https://avatars.githubusercontent.com/u/2464675?v=4&s=117" width="117">](https://github.com/domaslasauskas)[<img alt="enolan" src="https://avatars.githubusercontent.com/u/61517?v=4&s=117" width="117">](https://github.com/enolan)[<img alt="EduardMcfly" src="https://avatars.githubusercontent.com/u/16842163?v=4&s=117" width="117">](https://github.com/EduardMcfly)

[<img alt="gdinn" src="https://avatars.githubusercontent.com/u/19908659?v=4&s=117" width="117">](https://github.com/gdinn)[<img alt="adamldoyle" src="https://avatars.githubusercontent.com/u/86401?v=4&s=117" width="117">](https://github.com/adamldoyle)[<img alt="thejuan" src="https://avatars.githubusercontent.com/u/329807?v=4&s=117" width="117">](https://github.com/thejuan)[<img alt="adam-nielsen" src="https://avatars.githubusercontent.com/u/278772?v=4&s=117" width="117">](https://github.com/adam-nielsen)[<img alt="againer" src="https://avatars.githubusercontent.com/u/509709?v=4&s=117" width="117">](https://github.com/againer)[<img alt="AlbertXingZhang" src="https://avatars.githubusercontent.com/u/12808025?v=4&s=117" width="117">](https://github.com/AlbertXingZhang)

[<img alt="aldenquimby" src="https://avatars.githubusercontent.com/u/2145098?v=4&s=117" width="117">](https://github.com/aldenquimby)[<img alt="alebianco-doxee" src="https://avatars.githubusercontent.com/u/56639478?v=4&s=117" width="117">](https://github.com/alebianco-doxee)[<img alt="koterpillar" src="https://avatars.githubusercontent.com/u/140276?v=4&s=117" width="117">](https://github.com/koterpillar)[<img alt="aliclark" src="https://avatars.githubusercontent.com/u/85300?v=4&s=117" width="117">](https://github.com/aliclark)[<img alt="andersem" src="https://avatars.githubusercontent.com/u/509817?v=4&s=117" width="117">](https://github.com/andersem)[<img alt="triptec" src="https://avatars.githubusercontent.com/u/240159?v=4&s=117" width="117">](https://github.com/triptec)

[<img alt="m0ppers" src="https://avatars.githubusercontent.com/u/819421?v=4&s=117" width="117">](https://github.com/m0ppers)[<img alt="cspotcode" src="https://avatars.githubusercontent.com/u/376504?v=4&s=117" width="117">](https://github.com/cspotcode)[<img alt="AndrewCEmil" src="https://avatars.githubusercontent.com/u/2167475?v=4&s=117" width="117">](https://github.com/AndrewCEmil)[<img alt="mapsi" src="https://avatars.githubusercontent.com/u/516735?v=4&s=117" width="117">](https://github.com/mapsi)[<img alt="aliatsis" src="https://avatars.githubusercontent.com/u/4140524?v=4&s=117" width="117">](https://github.com/aliatsis)[<img alt="akaila" src="https://avatars.githubusercontent.com/u/484181?v=4&s=117" width="117">](https://github.com/akaila)

[<img alt="austencollins" src="https://avatars.githubusercontent.com/u/2752551?v=4&s=117" width="117">](https://github.com/austencollins)[<img alt="austin-payne" src="https://avatars.githubusercontent.com/u/29075091?v=4&s=117" width="117">](https://github.com/austin-payne)[<img alt="BenjaminBergerM" src="https://avatars.githubusercontent.com/u/50329833?v=4&s=117" width="117">](https://github.com/BenjaminBergerM)[<img alt="MEGApixel23" src="https://avatars.githubusercontent.com/u/4102786?v=4&s=117" width="117">](https://github.com/MEGApixel23)[<img alt="idmontie" src="https://avatars.githubusercontent.com/u/412382?v=4&s=117" width="117">](https://github.com/idmontie)[<img alt="ihendriks" src="https://avatars.githubusercontent.com/u/7311659?v=4&s=117" width="117">](https://github.com/ihendriks)

[<img alt="jacintoArias" src="https://avatars.githubusercontent.com/u/7511199?v=4&s=117" width="117">](https://github.com/jacintoArias)[<img alt="JacekDuszenko" src="https://avatars.githubusercontent.com/u/24210015?v=4&s=117" width="117">](https://github.com/JacekDuszenko)[<img alt="jgrigg" src="https://avatars.githubusercontent.com/u/12800024?v=4&s=117" width="117">](https://github.com/jgrigg)[<img alt="jankdc" src="https://avatars.githubusercontent.com/u/8384002?v=4&s=117" width="117">](https://github.com/jankdc)[<img alt="janicduplessis" src="https://avatars.githubusercontent.com/u/2677334?v=4&s=117" width="117">](https://github.com/janicduplessis)[<img alt="jsnajdr" src="https://avatars.githubusercontent.com/u/664258?v=4&s=117" width="117">](https://github.com/jsnajdr)

[<img alt="horyd" src="https://avatars.githubusercontent.com/u/916414?v=4&s=117" width="117">](https://github.com/horyd)[<img alt="jasonfungsing" src="https://avatars.githubusercontent.com/u/1302364?v=4&s=117" width="117">](https://github.com/jasonfungsing)[<img alt="jaydp17" src="https://avatars.githubusercontent.com/u/1743425?v=4&s=117" width="117">](https://github.com/jaydp17)[<img alt="jeremygiberson" src="https://avatars.githubusercontent.com/u/487411?v=4&s=117" width="117">](https://github.com/jeremygiberson)[<img alt="josephwarrick" src="https://avatars.githubusercontent.com/u/5392984?v=4&s=117" width="117">](https://github.com/josephwarrick)[<img alt="jlsjonas" src="https://avatars.githubusercontent.com/u/932193?v=4&s=117" width="117">](https://github.com/jlsjonas)

[<img alt="jonathonadams" src="https://avatars.githubusercontent.com/u/24870903?v=4&s=117" width="117">](https://github.com/jonathonadams)[<img alt="joostfarla" src="https://avatars.githubusercontent.com/u/851863?v=4&s=117" width="117">](https://github.com/joostfarla)[<img alt="TheTeaCat" src="https://avatars.githubusercontent.com/u/20339741?v=4&s=117" width="117">](https://github.com/TheTeaCat)[<img alt="jeromemacias" src="https://avatars.githubusercontent.com/u/582446?v=4&s=117" width="117">](https://github.com/jeromemacias)[<img alt="eeroniemi" src="https://avatars.githubusercontent.com/u/1384231?v=4&s=117" width="117">](https://github.com/eeroniemi)[<img alt="minibikini" src="https://avatars.githubusercontent.com/u/439309?v=4&s=117" width="117">](https://github.com/minibikini)

[<img alt="em0ney" src="https://avatars.githubusercontent.com/u/5679658?v=4&s=117" width="117">](https://github.com/em0ney)[<img alt="webdeveric" src="https://avatars.githubusercontent.com/u/1823514?v=4&s=117" width="117">](https://github.com/webdeveric)[<img alt="fernyettheplant" src="https://avatars.githubusercontent.com/u/3887243?v=4&s=117" width="117">](https://github.com/fernyettheplant)[<img alt="fernandomoraes" src="https://avatars.githubusercontent.com/u/2366763?v=4&s=117" width="117">](https://github.com/fernandomoraes)[<img alt="panva" src="https://avatars.githubusercontent.com/u/241506?v=4&s=117" width="117">](https://github.com/panva)[<img alt="Edweis" src="https://avatars.githubusercontent.com/u/18052624?v=4&s=117" width="117">](https://github.com/Edweis)

[<img alt="frodeaa" src="https://avatars.githubusercontent.com/u/45172?v=4&s=117" width="117">](https://github.com/frodeaa)[<img alt="gbroques" src="https://avatars.githubusercontent.com/u/12969835?v=4&s=117" width="117">](https://github.com/gbroques)[<img alt="ganey" src="https://avatars.githubusercontent.com/u/1401832?v=4&s=117" width="117">](https://github.com/ganey)[<img alt="geoffmanningcleartrace" src="https://avatars.githubusercontent.com/u/101125585?v=4&s=117" width="117">](https://github.com/geoffmanningcleartrace)[<img alt="grakic-glopal" src="https://avatars.githubusercontent.com/u/118749735?v=4&s=117" width="117">](https://github.com/grakic-glopal)[<img alt="guillaume" src="https://avatars.githubusercontent.com/u/368?v=4&s=117" width="117">](https://github.com/guillaume)

[<img alt="mebibou" src="https://avatars.githubusercontent.com/u/305342?v=4&s=117" width="117">](https://github.com/mebibou)[<img alt="balassy" src="https://avatars.githubusercontent.com/u/1872777?v=4&s=117" width="117">](https://github.com/balassy)[<img alt="bayoudhi" src="https://avatars.githubusercontent.com/u/3085156?v=4&s=117" width="117">](https://github.com/bayoudhi)[<img alt="enapupe" src="https://avatars.githubusercontent.com/u/291082?v=4&s=117" width="117">](https://github.com/enapupe)[<img alt="aardvarkk" src="https://avatars.githubusercontent.com/u/1251092?v=4&s=117" width="117">](https://github.com/aardvarkk)[<img alt="iansu" src="https://avatars.githubusercontent.com/u/433725?v=4&s=117" width="117">](https://github.com/iansu)
