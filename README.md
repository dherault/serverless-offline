# Serverless Offline

<p>
  <a href="https://www.serverless.com">
    <img src="http://public.serverless.com/badges/v3.svg">
  </a>
  <a href="https://www.npmjs.com/package/serverless-offline">
    <img src="https://img.shields.io/npm/v/serverless-offline.svg?style=flat-square">
  </a>
  <a href="https://travis-ci.com/dherault/serverless-offline">
    <img src="https://img.shields.io/travis/dherault/serverless-offline.svg?style=flat-square">
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
</p>

This [Serverless](https://github.com/serverless/serverless) plugin emulates [AWS λ](https://aws.amazon.com/lambda) and [API Gateway](https://aws.amazon.com/api-gateway) on your local machine to speed up your development cycles.
To do so, it starts an HTTP server that handles the request's lifecycle like APIG does and invokes your handlers.

**Features:**

* [Node.js](https://nodejs.org), [Python](https://www.python.org), [Ruby](https://www.ruby-lang.org) and [Go](https://golang.org) λ runtimes.
* Velocity templates support.
* Lazy loading of your files with require cache invalidation: no need for a reloading tool like Nodemon.
* And more: integrations, authorizers, proxies, timeouts, responseParameters, HTTPS, CORS, etc...

This plugin is updated by its users, I just do maintenance and ensure that PRs are relevant to the community. In other words, if you [find a bug or want a new feature](https://github.com/dherault/serverless-offline/issues), please help us by becoming one of the [contributors](https://github.com/dherault/serverless-offline/graphs/contributors) :v: ! See the [contributing section](#contributing).

## Documentation

* [Installation](#installation)
* [Usage and command line options](#usage-and-command-line-options)
* [Usage with invoke](#usage-with-invoke)
* [Token authorizers](#token-authorizers)
* [Custom authorizers](#custom-authorizers)
* [Remote authorizers](#remote-authorizers)
* [Custom headers](#custom-headers)
* [Environment variables](#environment-variables)
* [AWS API Gateway features](#aws-api-gateway-features)
* [WebSocket](#websocket)
* [Usage with Webpack](#usage-with-webpack)
* [Velocity nuances](#velocity-nuances)
* [Debug process](#debug-process)
* [Scoped execution](#scoped-execution)
* [Simulation quality](#simulation-quality)
* [Credits and inspiration](#credits-and-inspiration)
* [License](#license)
* [Contributing](#contributing)

## Installation

First, add Serverless Offline to your project:

`npm install serverless-offline --save-dev`

Then inside your project's `serverless.yml` file add following entry to the plugins section: `serverless-offline`. If there is no plugin section you will need to add it to the file.

It should look something like this:

```YAML
plugins:
  - serverless-offline
```

You can check wether you have successfully installed the plugin by running the serverless command line:

`serverless`

the console should display _Offline_ as one of the plugins now available in your Serverless project.

## Usage and command line options

In your project root run:

`serverless offline` or `sls offline`.

to list all the options for the plugin run:

`sls offline --help`

All CLI options are optional:

```
--apiKey                    Defines the API key value to be used for endpoints marked as private Defaults to a random hash.
--binPath               -b  Path to the Serverless binary. Default: globally-installed `sls`
--cacheInvalidationRegex    Provide the plugin with a regexp to use for ignoring cache invalidation. Default: 'node_modules'
--corsAllowHeaders          Used as default Access-Control-Allow-Headers header value for responses. Delimit multiple values with commas. Default: 'accept,content-type,x-api-key'
--corsAllowOrigin           Used as default Access-Control-Allow-Origin header value for responses. Delimit multiple values with commas. Default: '*'
--corsDisallowCredentials   When provided, the default Access-Control-Allow-Credentials header value will be passed as 'false'. Default: true
--corsExposedHeaders        Used as additional Access-Control-Exposed-Headers header value for responses. Delimit multiple values with commas. Default: 'WWW-Authenticate,Server-Authorization'
--disableCookieValidation   Used to disable cookie-validation on hapi.js-server
--enforceSecureCookies      Enforce secure cookies
--exec "<script>"           When provided, a shell script is executed when the server starts up, and the server will shut down after handling this command
--hideStackTraces           Hide the stack trace on lambda failure. Default: false
--host                  -o  Host name to listen on. Default: localhost
--httpsProtocol         -H  To enable HTTPS, specify directory (relative to your cwd, typically your project dir) for both cert.pem and key.pem files
--location              -l  The root location of the handlers' files. Defaults to the current directory
--noAuth                    Turns off all authorizers
--noEnvironment             Turns off loading of your environment variables from serverless.yml. Allows the usage of tools such as PM2 or docker-compose
--noTimeout             -t  Disables the timeout feature.
--port                  -P  Port to listen on. Default: 3000
--prefix                -p  Adds a prefix to every path, to send your requests to http://localhost:3000/[prefix]/[your_path] instead. E.g. -p dev
--preserveTrailingSlash     Used to keep trailing slashes on the request path
--printOutput               Turns on logging of your lambda outputs in the terminal.
--providedRuntime           Sets the runtime for "provided" lambda runtimes
--region                -r  The region used to populate your templates. Default: the first region for the first stage found.
--resourceRoutes            Turns on loading of your HTTP proxy settings from serverless.yml
--showDuration              Show the execution time duration of the lambda function.
--skipCacheInvalidation -c  Tells the plugin to skip require cache invalidation. A script reloading tool like Nodemon might then be needed
--stage                 -s  The stage used to populate your templates. Default: the first stage found in your project.
--useSeparateProcesses      Run handlers in separate Node processes
--websocketPort             WebSocket port to listen on. Default: 3001
```

Any of the CLI options can be added to your `serverless.yml`. For example:

```
custom:
  serverless-offline:
    httpsProtocol: "dev-certs"
    port: 4000
```

Options passed on the command line override YAML options.

By default you can send your requests to `http://localhost:3000/`. Please note that:

* You'll need to restart the plugin if you modify your `serverless.yml` or any of the default velocity template files.
* The event object passed to your λs has one extra key: `{ isOffline: true }`. Also, `process.env.IS_OFFLINE` is `true`.
* When no Content-Type header is set on a request, API Gateway defaults to `application/json`, and so does the plugin.
  But if you send an `application/x-www-form-urlencoded` or a `multipart/form-data` body with an `application/json` (or no) Content-Type, API Gateway won't parse your data (you'll get the ugly raw as input), whereas the plugin will answer 400 (malformed JSON).
  Please consider explicitly setting your requests' Content-Type and using separate templates.

## Usage with `invoke`

To use `AWS.invoke` you need to set the lambda `endpoint` to the serverless endpoint:

```js
const lambda = new AWS.Lambda({
  apiVersion: '2015-03-31',
  region: 'us-east-1',
  endpoint: process.env.IS_OFFLINE ? 'http://localhost:3000' : undefined,
})
```

All your lambdas can then be invoked in a handler using

```js
const lambdaInvokeParameters = {
  FunctionName: 'my-service-stage-function',
  InvocationType: 'Event',
  LogType: 'None',
  Payload: JSON.stringify({ data: 'foo' }),
}

lambda.invoke(lambdaInvokeParameters).send()
```

## Token authorizers

As defined in the [Serverless Documentation](https://serverless.com/framework/docs/providers/aws/events/apigateway/#setting-api-keys-for-your-rest-api) you can use API Keys as a simple authentication method.

Serverless-offline will emulate the behaviour of APIG and create a random token that's printed on the screen. With this token you can access your private methods adding `x-api-key: generatedToken` to your request header. All api keys will share the same token. To specify a custom token use the `--apiKey` cli option.

## Custom authorizers

Only [custom authorizers](https://aws.amazon.com/blogs/compute/introducing-custom-authorizers-in-amazon-api-gateway/) are supported. Custom authorizers are executed before a Lambda function is executed and return an Error or a Policy document.

The Custom authorizer is passed an `event` object as below:

```javascript
{
  "type": "TOKEN",
  "authorizationToken": "<Incoming bearer token>",
  "methodArn": "arn:aws:execute-api:<Region id>:<Account id>:<API id>/<Stage>/<Method>/<Resource path>"
}
```

The `methodArn` does not include the Account id or API id.

The plugin only supports retrieving Tokens from headers. You can configure the header as below:

```javascript
"authorizer": {
  "type": "TOKEN",
  "identitySource": "method.request.header.Authorization", // or method.request.header.SomeOtherHeader
  "authorizerResultTtlInSeconds": "0"
}
```
## Remote authorizers
You are able to mock the response from remote authorizers by setting the environmental variable `AUTHORIZER` before running `sls offline start`

Example:
> Unix: `export AUTHORIZER='{"principalId": "123"}'`

> Windows: `SET AUTHORIZER='{"principalId": "123"}'`

## Custom headers
You are able to use some custom headers in your request to gain more control over the requestContext object.

| Header | Event key |
|--------|-----------|
| cognito-identity-id | event.requestContext.identity.cognitoIdentityId |
| cognito-authentication-provider | event.requestContext.identity.cognitoAuthenticationProvider |

By doing this you are now able to change those values using a custom header. This can help you with easier authentication or retrieving the userId from a `cognitoAuthenticationProvider` value.

## Environment variables
You are able to use environmnet variables to customize identity params in event context.

| Environment Variable | Event key |
|----------------------|-----------|
| SLS_COGNITO_IDENTITY_POOL_ID | event.requestContext.identity.cognitoIdentityPoolId |
| SLS_ACCOUNT_ID | event.requestContext.identity.accountId |
| SLS_COGNITO_IDENTITY_ID | event.requestContext.identity.cognitoIdentityId |
| SLS_CALLER | event.requestContext.identity.caller |
| SLS_API_KEY | event.requestContext.identity.apiKey |
| SLS_COGNITO_AUTHENTICATION_TYPE | event.requestContext.identity.cognitoAuthenticationType |
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

### CORS

[Serverless doc](https://serverless.com/framework/docs/providers/aws/events/apigateway#enabling-cors)

If the endpoint config has CORS set to true, the plugin will use the CLI CORS options for the associated route.
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

```
custom:
  serverless-offline:
    resourceRoutes: true
```

or

```
    YourCloudFormationMethodId:
      Type: AWS::ApiGateway::Method
      Properties:
        ......
        Integration:
          Type: HTTP_PROXY
          Uri: 'https://s3-${self:custom.region}.amazonaws.com/${self:custom.yourBucketName}/{proxy}'
          ......
```

```
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

```javascript
"responseParameters": {
  "method.response.header.X-Powered-By": "Serverless", // a string
  "method.response.header.Warning": "integration.response.body", // the whole response
  "method.response.header.Location": "integration.response.body.some.key" // a pseudo JSON-path
},
```

## WebSocket

:warning: *This functionality is experimental. Please report any bugs or missing features. PRs are welcome!*

Usage in order to send messages back to clients:

`POST http://localhost:3001/@connections/{connectionId}`

Or,

```js
const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
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

Authorizers and wss:// are currently not supported.

## Usage with Webpack

Use [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack) to compile and bundle your ES-next code

## Velocity nuances

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

```javascript
{
  "payload": {
    "id": 1
  },
  "id_json": 1,
  "id_path": "1" // Notice the string
}
```

Whereas Offline parses:

```javascript
{
  "payload": {
    "id": 1
  },
  "id_json": 1,
  "id_path": 1, // Notice the number
  "isOffline": true
}
```

Accessing an attribute after using `$input.path` will return a string on AWS (expect strings like `"1"` or `"true"`) but not with Offline (`1` or `true`).
You may find other differences.

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

Depending on the breakpoint, you may need to call the URL path for your function in seperate browser window for your serverless function to be run and made available for debugging.

## Resource permissions and AWS profile

Lambda functions assume an IAM role during execution: the framework creates this role and set all the permission provided in the `iamRoleStatements` section of `serverless.yml`.

However, serverless offline makes use of your local AWS profile credentials to run the lambda functions and that might result in a different set of permissions. By default, the aws-sdk would load credentials for you default AWS profile specified in your configuration file.

You can change this profile directly in the code or by setting proper environment variables. Setting the `AWS_PROFILE` environment variable before calling `serverless` offline to a different profile would effectively change the credentials, e.g.

`AWS_PROFILE=<profile> serverless offline`

## Scoped execution

Serverless offline plugin can invoke shell scripts when a simulated server has been started up for the purposes of integration testing. Downstream plugins may tie into the
"before:offline:start:end" hook to release resources when the server is shutting down.

`> sls offline start --exec "./startIntegrationTests.sh"`

## Simulation quality

This plugin simulates API Gateway for many practical purposes, good enough for development - but is not a perfect simulator.
Specifically, Lambda currently runs on Node v6.10.0 and v8.10.0 ([AWS Docs](https://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html)), whereas _Offline_ runs on your own runtime where no memory limits are enforced.


## Usage with serverless-dynamodb-local and serverless-webpack plugin

Run `serverless offline start`. In comparison with `serverless offline`, the `start` command will fire an `init` and a `end` lifecycle hook which is needed for serverless-offline and serverless-dynamodb-local to switch off resources.

Add plugins to your `serverless.yml` file:

```yaml
plugins:
  - serverless-webpack
  - serverless-dynamodb-local
  - serverless-offline #serverless-offline needs to be last in the list
```

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

[<img alt="dherault" src="https://avatars2.githubusercontent.com/u/4154003?v=4&s=117" width="117">](https://github.com/dherault) |[<img alt="dnalborczyk" src="https://avatars1.githubusercontent.com/u/2903325?v=4&s=117" width="117">](https://github.com/dnalborczyk) |[<img alt="leonardoalifraco" src="https://avatars0.githubusercontent.com/u/2942943?v=4&s=117" width="117">](https://github.com/leonardoalifraco) |[<img alt="daniel-cottone" src="https://avatars3.githubusercontent.com/u/26556340?v=4&s=117" width="117">](https://github.com/daniel-cottone) |[<img alt="Bilal-S" src="https://avatars0.githubusercontent.com/u/668901?v=4&s=117" width="117">](https://github.com/Bilal-S) |
:---: |:---: |:---: |:---: |:---: |
[dherault](https://github.com/dherault) |[dnalborczyk](https://github.com/dnalborczyk) |[leonardoalifraco](https://github.com/leonardoalifraco) |[daniel-cottone](https://github.com/daniel-cottone) |[Bilal-S](https://github.com/Bilal-S) |

[<img alt="mikestaub" src="https://avatars2.githubusercontent.com/u/1254558?v=4&s=117" width="117">](https://github.com/mikestaub) |[<img alt="zoellner" src="https://avatars2.githubusercontent.com/u/2665319?v=4&s=117" width="117">](https://github.com/zoellner) |[<img alt="johncmckim" src="https://avatars2.githubusercontent.com/u/1297227?v=4&s=117" width="117">](https://github.com/johncmckim) |[<img alt="dl748" src="https://avatars1.githubusercontent.com/u/4815868?v=4&s=117" width="117">](https://github.com/dl748) |[<img alt="ThisIsNoZaku" src="https://avatars1.githubusercontent.com/u/4680766?v=4&s=117" width="117">](https://github.com/ThisIsNoZaku) |
:---: |:---: |:---: |:---: |:---: |
[mikestaub](https://github.com/mikestaub) |[zoellner](https://github.com/zoellner) |[johncmckim](https://github.com/johncmckim) |[dl748](https://github.com/dl748) |[ThisIsNoZaku](https://github.com/ThisIsNoZaku) |

[<img alt="darthtrevino" src="https://avatars0.githubusercontent.com/u/113544?v=4&s=117" width="117">](https://github.com/darthtrevino) |[<img alt="gertjvr" src="https://avatars0.githubusercontent.com/u/1691062?v=4&s=117" width="117">](https://github.com/gertjvr) |[<img alt="miltador" src="https://avatars3.githubusercontent.com/u/17062283?v=4&s=117" width="117">](https://github.com/miltador) |[<img alt="juanjoDiaz" src="https://avatars0.githubusercontent.com/u/3322485?v=4&s=117" width="117">](https://github.com/juanjoDiaz) |[<img alt="hueniverse" src="https://avatars2.githubusercontent.com/u/56631?v=4&s=117" width="117">](https://github.com/hueniverse) |
:---: |:---: |:---: |:---: |:---: |
[darthtrevino](https://github.com/darthtrevino) |[gertjvr](https://github.com/gertjvr) |[miltador](https://github.com/miltador) |[juanjoDiaz](https://github.com/juanjoDiaz) |[hueniverse](https://github.com/hueniverse) |

[<img alt="ansraliant" src="https://avatars1.githubusercontent.com/u/7121475?v=4&s=117" width="117">](https://github.com/ansraliant) |[<img alt="perkyguy" src="https://avatars3.githubusercontent.com/u/4624648?v=4&s=117" width="117">](https://github.com/perkyguy) |[<img alt="jack-seek" src="https://avatars1.githubusercontent.com/u/19676584?v=4&s=117" width="117">](https://github.com/jack-seek) |[<img alt="joubertredrat" src="https://avatars2.githubusercontent.com/u/1520407?v=4&s=117" width="117">](https://github.com/joubertredrat) |[<img alt="robbtraister" src="https://avatars3.githubusercontent.com/u/5815296?v=4&s=117" width="117">](https://github.com/robbtraister) |
:---: |:---: |:---: |:---: |:---: |
[ansraliant](https://github.com/ansraliant) |[perkyguy](https://github.com/perkyguy) |[jack-seek](https://github.com/jack-seek) |[joubertredrat](https://github.com/joubertredrat) |[robbtraister](https://github.com/robbtraister) |

[<img alt="dortega3000" src="https://avatars1.githubusercontent.com/u/6676525?v=4&s=117" width="117">](https://github.com/dortega3000) |[<img alt="awwong1" src="https://avatars0.githubusercontent.com/u/2760111?v=4&s=117" width="117">](https://github.com/awwong1) |[<img alt="andreipopovici" src="https://avatars0.githubusercontent.com/u/1143417?v=4&s=117" width="117">](https://github.com/andreipopovici) |[<img alt="Andorbal" src="https://avatars1.githubusercontent.com/u/579839?v=4&s=117" width="117">](https://github.com/Andorbal) |[<img alt="AyushG3112" src="https://avatars0.githubusercontent.com/u/21307931?v=4&s=117" width="117">](https://github.com/AyushG3112) |
:---: |:---: |:---: |:---: |:---: |
[dortega3000](https://github.com/dortega3000) |[awwong1](https://github.com/awwong1) |[andreipopovici](https://github.com/andreipopovici) |[Andorbal](https://github.com/Andorbal) |[AyushG3112](https://github.com/AyushG3112) |

[<img alt="franciscocpg" src="https://avatars1.githubusercontent.com/u/3680556?v=4&s=117" width="117">](https://github.com/franciscocpg) |[<img alt="kajwiklund" src="https://avatars2.githubusercontent.com/u/6842806?v=4&s=117" width="117">](https://github.com/kajwiklund) |[<img alt="ondrowan" src="https://avatars2.githubusercontent.com/u/423776?v=4&s=117" width="117">](https://github.com/ondrowan) |[<img alt="Bob-Thomas" src="https://avatars3.githubusercontent.com/u/2785213?v=4&s=117" width="117">](https://github.com/Bob-Thomas) |[<img alt="c24w" src="https://avatars2.githubusercontent.com/u/710406?v=4&s=117" width="117">](https://github.com/c24w) |
:---: |:---: |:---: |:---: |:---: |
[franciscocpg](https://github.com/franciscocpg) |[kajwiklund](https://github.com/kajwiklund) |[ondrowan](https://github.com/ondrowan) |[Bob-Thomas](https://github.com/Bob-Thomas) |[c24w](https://github.com/c24w) |

[<img alt="vmadman" src="https://avatars1.githubusercontent.com/u/1026490?v=4&s=117" width="117">](https://github.com/vmadman) |[<img alt="encounter" src="https://avatars3.githubusercontent.com/u/549122?v=4&s=117" width="117">](https://github.com/encounter) |[<img alt="adieuadieu" src="https://avatars1.githubusercontent.com/u/438848?v=4&s=117" width="117">](https://github.com/adieuadieu) |[<img alt="njriordan" src="https://avatars2.githubusercontent.com/u/11200170?v=4&s=117" width="117">](https://github.com/njriordan) |[<img alt="bebbi" src="https://avatars0.githubusercontent.com/u/2752391?v=4&s=117" width="117">](https://github.com/bebbi) |
:---: |:---: |:---: |:---: |:---: |
[vmadman](https://github.com/vmadman) |[encounter](https://github.com/encounter) |[adieuadieu](https://github.com/adieuadieu) |[njriordan](https://github.com/njriordan) |[bebbi](https://github.com/bebbi) |

[<img alt="trevor-leach" src="https://avatars0.githubusercontent.com/u/39206334?v=4&s=117" width="117">](https://github.com/trevor-leach) |[<img alt="emmoistner" src="https://avatars2.githubusercontent.com/u/5419727?v=4&s=117" width="117">](https://github.com/emmoistner) |[<img alt="OrKoN" src="https://avatars3.githubusercontent.com/u/399150?v=4&s=117" width="117">](https://github.com/OrKoN) |[<img alt="apalumbo" src="https://avatars0.githubusercontent.com/u/1729784?v=4&s=117" width="117">](https://github.com/apalumbo) |[<img alt="ablythe" src="https://avatars2.githubusercontent.com/u/6164745?v=4&s=117" width="117">](https://github.com/ablythe) |
:---: |:---: |:---: |:---: |:---: |
[trevor-leach](https://github.com/trevor-leach) |[emmoistner](https://github.com/emmoistner) |[OrKoN](https://github.com/OrKoN) |[apalumbo](https://github.com/apalumbo) |[ablythe](https://github.com/ablythe) |

[<img alt="anishkny" src="https://avatars0.githubusercontent.com/u/357499?v=4&s=117" width="117">](https://github.com/anishkny) |[<img alt="cameroncooper" src="https://avatars3.githubusercontent.com/u/898689?v=4&s=117" width="117">](https://github.com/cameroncooper) |[<img alt="dschep" src="https://avatars0.githubusercontent.com/u/667763?v=4&s=117" width="117">](https://github.com/dschep) |[<img alt="dwbelliston" src="https://avatars2.githubusercontent.com/u/11450118?v=4&s=117" width="117">](https://github.com/dwbelliston) |[<img alt="eabadjiev" src="https://avatars0.githubusercontent.com/u/934059?v=4&s=117" width="117">](https://github.com/eabadjiev) |
:---: |:---: |:---: |:---: |:---: |
[anishkny](https://github.com/anishkny) |[cameroncooper](https://github.com/cameroncooper) |[dschep](https://github.com/dschep) |[dwbelliston](https://github.com/dwbelliston) |[eabadjiev](https://github.com/eabadjiev) |

[<img alt="Arkfille" src="https://avatars2.githubusercontent.com/u/19840740?v=4&s=117" width="117">](https://github.com/Arkfille) |[<img alt="garunski" src="https://avatars0.githubusercontent.com/u/1002770?v=4&s=117" width="117">](https://github.com/garunski) |[<img alt="james-relyea" src="https://avatars0.githubusercontent.com/u/1944491?v=4&s=117" width="117">](https://github.com/james-relyea) |[<img alt="joewestcott" src="https://avatars0.githubusercontent.com/u/11187741?v=4&s=117" width="117">](https://github.com/joewestcott) |[<img alt="LoganArnett" src="https://avatars2.githubusercontent.com/u/8780547?v=4&s=117" width="117">](https://github.com/LoganArnett) |
:---: |:---: |:---: |:---: |:---: |
[Arkfille](https://github.com/Arkfille) |[garunski](https://github.com/garunski) |[james-relyea](https://github.com/james-relyea) |[joewestcott](https://github.com/joewestcott) |[LoganArnett](https://github.com/LoganArnett) |

[<img alt="djcrabhat" src="https://avatars2.githubusercontent.com/u/803042?v=4&s=117" width="117">](https://github.com/djcrabhat) |[<img alt="marccampbell" src="https://avatars3.githubusercontent.com/u/173451?v=4&s=117" width="117">](https://github.com/marccampbell) |[<img alt="purefan" src="https://avatars1.githubusercontent.com/u/315880?v=4&s=117" width="117">](https://github.com/purefan) |[<img alt="mzmiric5" src="https://avatars1.githubusercontent.com/u/1480072?v=4&s=117" width="117">](https://github.com/mzmiric5) |[<img alt="paulhbarker" src="https://avatars0.githubusercontent.com/u/7366567?v=4&s=117" width="117">](https://github.com/paulhbarker) |
:---: |:---: |:---: |:---: |:---: |
[djcrabhat](https://github.com/djcrabhat) |[marccampbell](https://github.com/marccampbell) |[purefan](https://github.com/purefan) |[mzmiric5](https://github.com/mzmiric5) |[paulhbarker](https://github.com/paulhbarker) |

[<img alt="pmuens" src="https://avatars3.githubusercontent.com/u/1606004?v=4&s=117" width="117">](https://github.com/pmuens) |[<img alt="pierreis" src="https://avatars2.githubusercontent.com/u/203973?v=4&s=117" width="117">](https://github.com/pierreis) |[<img alt="emilioSavignone" src="https://avatars2.githubusercontent.com/u/10362370?v=4&s=117" width="117">](https://github.com/emilioSavignone) |[<img alt="rschick" src="https://avatars3.githubusercontent.com/u/423474?v=4&s=117" width="117">](https://github.com/rschick) |[<img alt="selcukcihan" src="https://avatars0.githubusercontent.com/u/7043904?v=4&s=117" width="117">](https://github.com/selcukcihan) |
:---: |:---: |:---: |:---: |:---: |
[pmuens](https://github.com/pmuens) |[pierreis](https://github.com/pierreis) |[emilioSavignone](https://github.com/emilioSavignone) |[rschick](https://github.com/rschick) |[selcukcihan](https://github.com/selcukcihan) |

[<img alt="patrickheeney" src="https://avatars3.githubusercontent.com/u/1407228?v=4&s=117" width="117">](https://github.com/patrickheeney) |[<img alt="rma4ok" src="https://avatars1.githubusercontent.com/u/470292?v=4&s=117" width="117">](https://github.com/rma4ok) |[<img alt="computerpunc" src="https://avatars3.githubusercontent.com/u/721008?v=4&s=117" width="117">](https://github.com/computerpunc) |[<img alt="clschnei" src="https://avatars3.githubusercontent.com/u/1232625?v=4&s=117" width="117">](https://github.com/clschnei) |[<img alt="adam-nielsen" src="https://avatars0.githubusercontent.com/u/278772?v=4&s=117" width="117">](https://github.com/adam-nielsen) |
:---: |:---: |:---: |:---: |:---: |
[patrickheeney](https://github.com/patrickheeney) |[rma4ok](https://github.com/rma4ok) |[computerpunc](https://github.com/computerpunc) |[clschnei](https://github.com/clschnei) |[adam-nielsen](https://github.com/adam-nielsen) |

[<img alt="adamelliottsweeting" src="https://avatars2.githubusercontent.com/u/8907331?v=4&s=117" width="117">](https://github.com/adamelliottsweeting) |[<img alt="againer" src="https://avatars3.githubusercontent.com/u/509709?v=4&s=117" width="117">](https://github.com/againer) |[<img alt="koterpillar" src="https://avatars0.githubusercontent.com/u/140276?v=4&s=117" width="117">](https://github.com/koterpillar) |[<img alt="m0ppers" src="https://avatars3.githubusercontent.com/u/819421?v=4&s=117" width="117">](https://github.com/m0ppers) |[<img alt="cspotcode" src="https://avatars1.githubusercontent.com/u/376504?v=4&s=117" width="117">](https://github.com/cspotcode) |
:---: |:---: |:---: |:---: |:---: |
[adamelliottsweeting](https://github.com/adamelliottsweeting) |[againer](https://github.com/againer) |[koterpillar](https://github.com/koterpillar) |[m0ppers](https://github.com/m0ppers) |[cspotcode](https://github.com/cspotcode) |

[<img alt="aliatsis" src="https://avatars3.githubusercontent.com/u/4140524?v=4&s=117" width="117">](https://github.com/aliatsis) |[<img alt="arnas" src="https://avatars3.githubusercontent.com/u/13507001?v=4&s=117" width="117">](https://github.com/arnas) |[<img alt="akaila" src="https://avatars2.githubusercontent.com/u/484181?v=4&s=117" width="117">](https://github.com/akaila) |[<img alt="ac360" src="https://avatars1.githubusercontent.com/u/2752551?v=4&s=117" width="117">](https://github.com/ac360) |[<img alt="austin-payne" src="https://avatars3.githubusercontent.com/u/29075091?v=4&s=117" width="117">](https://github.com/austin-payne) |
:---: |:---: |:---: |:---: |:---: |
[aliatsis](https://github.com/aliatsis) |[arnas](https://github.com/arnas) |[akaila](https://github.com/akaila) |[ac360](https://github.com/ac360) |[austin-payne](https://github.com/austin-payne) |

[<img alt="bencooling" src="https://avatars3.githubusercontent.com/u/718994?v=4&s=117" width="117">](https://github.com/bencooling) |[<img alt="BorjaMacedo" src="https://avatars1.githubusercontent.com/u/16381759?v=4&s=117" width="117">](https://github.com/BorjaMacedo) |[<img alt="BrandonE" src="https://avatars1.githubusercontent.com/u/542245?v=4&s=117" width="117">](https://github.com/BrandonE) |[<img alt="guerrerocarlos" src="https://avatars2.githubusercontent.com/u/82532?v=4&s=117" width="117">](https://github.com/guerrerocarlos) |[<img alt="altruisticsoftware" src="https://avatars3.githubusercontent.com/u/12105346?v=4&s=117" width="117">](https://github.com/altruisticsoftware) |
:---: |:---: |:---: |:---: |:---: |
[bencooling](https://github.com/bencooling) |[BorjaMacedo](https://github.com/BorjaMacedo) |[BrandonE](https://github.com/BrandonE) |[guerrerocarlos](https://github.com/guerrerocarlos) |[altruisticsoftware](https://github.com/altruisticsoftware) |

[<img alt="christophgysin" src="https://avatars0.githubusercontent.com/u/527924?v=4&s=117" width="117">](https://github.com/christophgysin) |[<img alt="Clement134" src="https://avatars2.githubusercontent.com/u/6473775?v=4&s=117" width="117">](https://github.com/Clement134) |[<img alt="rlgod" src="https://avatars2.githubusercontent.com/u/1705096?v=4&s=117" width="117">](https://github.com/rlgod) |[<img alt="dbunker" src="https://avatars1.githubusercontent.com/u/751580?v=4&s=117" width="117">](https://github.com/dbunker) |[<img alt="dobrynin" src="https://avatars3.githubusercontent.com/u/12061016?v=4&s=117" width="117">](https://github.com/dobrynin) |
:---: |:---: |:---: |:---: |:---: |
[christophgysin](https://github.com/christophgysin) |[Clement134](https://github.com/Clement134) |[rlgod](https://github.com/rlgod) |[dbunker](https://github.com/dbunker) |[dobrynin](https://github.com/dobrynin) |

[<img alt="domaslasauskas" src="https://avatars2.githubusercontent.com/u/2464675?v=4&s=117" width="117">](https://github.com/domaslasauskas) |[<img alt="enolan" src="https://avatars0.githubusercontent.com/u/61517?v=4&s=117" width="117">](https://github.com/enolan) |[<img alt="minibikini" src="https://avatars3.githubusercontent.com/u/439309?v=4&s=117" width="117">](https://github.com/minibikini) |[<img alt="em0ney" src="https://avatars0.githubusercontent.com/u/5679658?v=4&s=117" width="117">](https://github.com/em0ney) |[<img alt="erauer" src="https://avatars0.githubusercontent.com/u/792171?v=4&s=117" width="117">](https://github.com/erauer) |
:---: |:---: |:---: |:---: |:---: |
[domaslasauskas](https://github.com/domaslasauskas) |[enolan](https://github.com/enolan) |[minibikini](https://github.com/minibikini) |[em0ney](https://github.com/em0ney) |[erauer](https://github.com/erauer) |

[<img alt="gbroques" src="https://avatars0.githubusercontent.com/u/12969835?v=4&s=117" width="117">](https://github.com/gbroques) |[<img alt="guillaume" src="https://avatars1.githubusercontent.com/u/368?v=4&s=117" width="117">](https://github.com/guillaume) |[<img alt="balassy" src="https://avatars1.githubusercontent.com/u/1872777?v=4&s=117" width="117">](https://github.com/balassy) |[<img alt="idmontie" src="https://avatars3.githubusercontent.com/u/412382?v=4&s=117" width="117">](https://github.com/idmontie) |[<img alt="jacintoArias" src="https://avatars0.githubusercontent.com/u/7511199?v=4&s=117" width="117">](https://github.com/jacintoArias) |
:---: |:---: |:---: |:---: |:---: |
[gbroques](https://github.com/gbroques) |[guillaume](https://github.com/guillaume) |[balassy](https://github.com/balassy) |[idmontie](https://github.com/idmontie) |[jacintoArias](https://github.com/jacintoArias) |

[<img alt="jgrigg" src="https://avatars1.githubusercontent.com/u/12800024?v=4&s=117" width="117">](https://github.com/jgrigg) |[<img alt="jsnajdr" src="https://avatars3.githubusercontent.com/u/664258?v=4&s=117" width="117">](https://github.com/jsnajdr) |[<img alt="horyd" src="https://avatars3.githubusercontent.com/u/916414?v=4&s=117" width="117">](https://github.com/horyd) |[<img alt="jaydp17" src="https://avatars1.githubusercontent.com/u/1743425?v=4&s=117" width="117">](https://github.com/jaydp17) |[<img alt="jeremygiberson" src="https://avatars2.githubusercontent.com/u/487411?v=4&s=117" width="117">](https://github.com/jeremygiberson) |
:---: |:---: |:---: |:---: |:---: |
[jgrigg](https://github.com/jgrigg) |[jsnajdr](https://github.com/jsnajdr) |[horyd](https://github.com/horyd) |[jaydp17](https://github.com/jaydp17) |[jeremygiberson](https://github.com/jeremygiberson) |

[<img alt="josephwarrick" src="https://avatars2.githubusercontent.com/u/5392984?v=4&s=117" width="117">](https://github.com/josephwarrick) |[<img alt="jlsjonas" src="https://avatars1.githubusercontent.com/u/932193?v=4&s=117" width="117">](https://github.com/jlsjonas) |[<img alt="joostfarla" src="https://avatars0.githubusercontent.com/u/851863?v=4&s=117" width="117">](https://github.com/joostfarla) |[<img alt="kenleytomlin" src="https://avatars3.githubusercontent.com/u/3004590?v=4&s=117" width="117">](https://github.com/kenleytomlin) |[<img alt="lalifraco-devspark" src="https://avatars1.githubusercontent.com/u/13339324?v=4&s=117" width="117">](https://github.com/lalifraco-devspark) |
:---: |:---: |:---: |:---: |:---: |
[josephwarrick](https://github.com/josephwarrick) |[jlsjonas](https://github.com/jlsjonas) |[joostfarla](https://github.com/joostfarla) |[kenleytomlin](https://github.com/kenleytomlin) |[lalifraco-devspark](https://github.com/lalifraco-devspark) |

[<img alt="DynamicSTOP" src="https://avatars0.githubusercontent.com/u/9434504?v=4&s=117" width="117">](https://github.com/DynamicSTOP) |[<img alt="neverendingqs" src="https://avatars1.githubusercontent.com/u/8854618?v=4&s=117" width="117">](https://github.com/neverendingqs) |[<img alt="msjonker" src="https://avatars3.githubusercontent.com/u/781683?v=4&s=117" width="117">](https://github.com/msjonker) |[<img alt="Takeno" src="https://avatars0.githubusercontent.com/u/1499063?v=4&s=117" width="117">](https://github.com/Takeno) |[<img alt="mjmac" src="https://avatars1.githubusercontent.com/u/83737?v=4&s=117" width="117">](https://github.com/mjmac) |
:---: |:---: |:---: |:---: |:---: |
[DynamicSTOP](https://github.com/DynamicSTOP) |[neverendingqs](https://github.com/neverendingqs) |[msjonker](https://github.com/msjonker) |[Takeno](https://github.com/Takeno) |[mjmac](https://github.com/mjmac) |

[<img alt="ojongerius" src="https://avatars0.githubusercontent.com/u/1726055?v=4&s=117" width="117">](https://github.com/ojongerius) |[<img alt="thepont" src="https://avatars1.githubusercontent.com/u/2901992?v=4&s=117" width="117">](https://github.com/thepont) |[<img alt="WooDzu" src="https://avatars3.githubusercontent.com/u/2228236?v=4&s=117" width="117">](https://github.com/WooDzu) |[<img alt="PsychicCat" src="https://avatars3.githubusercontent.com/u/4073856?v=4&s=117" width="117">](https://github.com/PsychicCat) |[<img alt="wwsno" src="https://avatars0.githubusercontent.com/u/6328924?v=4&s=117" width="117">](https://github.com/wwsno) |
:---: |:---: |:---: |:---: |:---: |
[ojongerius](https://github.com/ojongerius) |[thepont](https://github.com/thepont) |[WooDzu](https://github.com/WooDzu) |[PsychicCat](https://github.com/PsychicCat) |[wwsno](https://github.com/wwsno) |

[<img alt="gribnoysup" src="https://avatars2.githubusercontent.com/u/5036933?v=4&s=117" width="117">](https://github.com/gribnoysup) |[<img alt="sethetter" src="https://avatars0.githubusercontent.com/u/655500?v=4&s=117" width="117">](https://github.com/sethetter) |[<img alt="starsprung" src="https://avatars3.githubusercontent.com/u/48957?v=4&s=117" width="117">](https://github.com/starsprung) |[<img alt="shineli-not-used-anymore" src="https://avatars3.githubusercontent.com/u/1043331?v=4&s=117" width="117">](https://github.com/shineli-not-used-anymore) |[<img alt="stesie" src="https://avatars1.githubusercontent.com/u/113068?v=4&s=117" width="117">](https://github.com/stesie) |
:---: |:---: |:---: |:---: |:---: |
[gribnoysup](https://github.com/gribnoysup) |[sethetter](https://github.com/sethetter) |[starsprung](https://github.com/starsprung) |[shineli-not-used-anymore](https://github.com/shineli-not-used-anymore) |[stesie](https://github.com/stesie) |

[<img alt="stevemao" src="https://avatars0.githubusercontent.com/u/6316590?v=4&s=117" width="117">](https://github.com/stevemao) |[<img alt="ittus" src="https://avatars3.githubusercontent.com/u/5120965?v=4&s=117" width="117">](https://github.com/ittus) |[<img alt="tiagogoncalves89" src="https://avatars2.githubusercontent.com/u/55122?v=4&s=117" width="117">](https://github.com/tiagogoncalves89) |[<img alt="tuanmh" src="https://avatars2.githubusercontent.com/u/3193353?v=4&s=117" width="117">](https://github.com/tuanmh) |[<img alt="Gregoirevda" src="https://avatars3.githubusercontent.com/u/12223738?v=4&s=117" width="117">](https://github.com/Gregoirevda) |
:---: |:---: |:---: |:---: |:---: |
[stevemao](https://github.com/stevemao) |[ittus](https://github.com/ittus) |[tiagogoncalves89](https://github.com/tiagogoncalves89) |[tuanmh](https://github.com/tuanmh) |[Gregoirevda](https://github.com/Gregoirevda) |

[<img alt="gcphost" src="https://avatars3.githubusercontent.com/u/1173636?v=4&s=117" width="117">](https://github.com/gcphost) |[<img alt="YaroslavApatiev" src="https://avatars0.githubusercontent.com/u/24372409?v=4&s=117" width="117">](https://github.com/YaroslavApatiev) |[<img alt="zacacollier" src="https://avatars2.githubusercontent.com/u/18710669?v=4&s=117" width="117">](https://github.com/zacacollier) |[<img alt="allenhartwig" src="https://avatars2.githubusercontent.com/u/1261521?v=4&s=117" width="117">](https://github.com/allenhartwig) |[<img alt="demetriusnunes" src="https://avatars0.githubusercontent.com/u/4699?v=4&s=117" width="117">](https://github.com/demetriusnunes) |
:---: |:---: |:---: |:---: |:---: |
[gcphost](https://github.com/gcphost) |[YaroslavApatiev](https://github.com/YaroslavApatiev) |[zacacollier](https://github.com/zacacollier) |[allenhartwig](https://github.com/allenhartwig) |[demetriusnunes](https://github.com/demetriusnunes) |

[<img alt="electrikdevelopment" src="https://avatars3.githubusercontent.com/u/14976795?v=4&s=117" width="117">](https://github.com/electrikdevelopment) |[<img alt="jgilbert01" src="https://avatars1.githubusercontent.com/u/1082126?v=4&s=117" width="117">](https://github.com/jgilbert01) |[<img alt="polaris340" src="https://avatars2.githubusercontent.com/u/2861192?v=4&s=117" width="117">](https://github.com/polaris340) |[<img alt="leruitga-ss" src="https://avatars1.githubusercontent.com/u/39830392?v=4&s=117" width="117">](https://github.com/leruitga-ss) |[<img alt="livingmine" src="https://avatars1.githubusercontent.com/u/7286614?v=4&s=117" width="117">](https://github.com/livingmine) |
:---: |:---: |:---: |:---: |:---: |
[electrikdevelopment](https://github.com/electrikdevelopment) |[jgilbert01](https://github.com/jgilbert01) |[polaris340](https://github.com/polaris340) |[leruitga-ss](https://github.com/leruitga-ss) |[livingmine](https://github.com/livingmine) |

[<img alt="lteacher" src="https://avatars3.githubusercontent.com/u/6103860?v=4&s=117" width="117">](https://github.com/lteacher) |[<img alt="martinmicunda" src="https://avatars1.githubusercontent.com/u/1643606?v=4&s=117" width="117">](https://github.com/martinmicunda) |[<img alt="nori3tsu" src="https://avatars0.githubusercontent.com/u/379587?v=4&s=117" width="117">](https://github.com/nori3tsu) |[<img alt="ppasmanik" src="https://avatars0.githubusercontent.com/u/3534835?v=4&s=117" width="117">](https://github.com/ppasmanik) |[<img alt="ryanzyy" src="https://avatars1.githubusercontent.com/u/2299226?v=4&s=117" width="117">](https://github.com/ryanzyy) |
:---: |:---: |:---: |:---: |:---: |
[lteacher](https://github.com/lteacher) |[martinmicunda](https://github.com/martinmicunda) |[nori3tsu](https://github.com/nori3tsu) |[ppasmanik](https://github.com/ppasmanik) |[ryanzyy](https://github.com/ryanzyy) |

[<img alt="constb" src="https://avatars3.githubusercontent.com/u/1006766?v=4&s=117" width="117">](https://github.com/constb) |
:---: |
[constb](https://github.com/constb) |
