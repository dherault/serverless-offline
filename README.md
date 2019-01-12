# Serverless Offline

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![npm version](https://badge.fury.io/js/serverless-offline.svg)](https://badge.fury.io/js/serverless-offline)
[![Build Status](https://travis-ci.org/dherault/serverless-offline.svg?branch=master)](https://travis-ci.org/dherault/serverless-offline)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

This [Serverless](https://github.com/serverless/serverless) plugin emulates AWS λ and API Gateway on your local machine to speed up your development cycles.
To do so, it starts an HTTP server that handles the request's lifecycle like APIG does and invokes your handlers.

**Features:**

* Node.js λ only.
* Velocity templates support.
* Lazy loading of your files with require cache invalidation: no need for a reloading tool like Nodemon.
* And more: integrations, authorizers, proxies, timeouts, responseParameters, HTTPS, CORS, etc...

This plugin is updated by its users, I just do maintenance and ensure that PRs are relevant to the community. In other words, if you [find a bug or want a new feature](https://github.com/dherault/serverless-offline/issues), please help us by becoming one of the [contributors](https://github.com/dherault/serverless-offline/graphs/contributors) :v: ! See the [contributing section](#contributing). We are looking for maintainers, see [this issue](https://github.com/dherault/serverless-offline/issues/304).

## Documentation

* [Installation](#installation)
* [Usage and command line options](#usage-and-command-line-options)
* [Usage with Webpack](#usage-with-webpack)
* [Token authorizers](#token-authorizers)
* [Custom authorizers](#custom-authorizers)
* [Remote authorizers](#remote-authorizers)
* [Custom headers](#custom-headers)
* [AWS API Gateway features](#aws-api-gateway-features)
* [Velocity nuances](#velocity-nuances)
* [Debug process](#debug-process)
* [Scoped execution](#scoped-execution)
* [Simulation quality](#simulation-quality)
* [Credits and inspiration](#credits-and-inspiration)
* [Contributing](#contributing)
* [License](#license)

## Installation

For Serverless v1 only. See [this branch](https://github.com/dherault/serverless-offline/tree/serverless_0.5) for 0.5.x versions.

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

`serverless offline start` or `sls offline start`.

to list all the options for the plugin run:

`sls offline --help`

All CLI options are optional:

```
--prefix                -p  Adds a prefix to every path, to send your requests to http://localhost:3000/[prefix]/[your_path] instead. E.g. -p dev
--location              -l  The root location of the handlers' files. Defaults to the current directory
--host                  -o  Host name to listen on. Default: localhost
--port                  -P  Port to listen on. Default: 3000
--stage                 -s  The stage used to populate your templates. Default: the first stage found in your project.
--region                -r  The region used to populate your templates. Default: the first region for the first stage found.
--noTimeout             -t  Disables the timeout feature.
--noEnvironment             Turns off loading of your environment variables from serverless.yml. Allows the usage of tools such as PM2 or docker-compose.
--resourceRoutes            Turns on loading of your HTTP proxy settings from serverless.yml.
--dontPrintOutput           Turns off logging of your lambda outputs in the terminal.
--httpsProtocol         -H  To enable HTTPS, specify directory (relative to your cwd, typically your project dir) for both cert.pem and key.pem files.
--skipCacheInvalidation -c  Tells the plugin to skip require cache invalidation. A script reloading tool like Nodemon might then be needed.
--cacheInvalidationRegex    Provide the plugin with a regexp to use for ignoring cache invalidation. Default: 'node_modules'
--useSeparateProcesses      Run handlers in separate Node processes
--corsAllowOrigin           Used as default Access-Control-Allow-Origin header value for responses. Delimit multiple values with commas. Default: '*'
--corsAllowHeaders          Used as default Access-Control-Allow-Headers header value for responses. Delimit multiple values with commas. Default: 'accept,content-type,x-api-key'
--corsExposedHeaders        Used as additional Access-Control-Exposed-Headers header value for responses. Delimit multiple values with commas. Default: 'WWW-Authenticate,Server-Authorization'
--corsDisallowCredentials   When provided, the default Access-Control-Allow-Credentials header value will be passed as 'false'. Default: true
--exec "<script>"           When provided, a shell script is executed when the server starts up, and the server will shut down after handling this command.
--noAuth                    Turns off all authorizers
--preserveTrailingSlash     Used to keep trailing slashes on the request path
--disableCookieValidation   Used to disable cookie-validation on hapi.js-server
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

## Usage with Webpack

Use [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack) to compile and bundle your ES-next code

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

## Contributing

Yes, thank you!
This plugin is community-driven, most of its features are from different authors.
Please update the docs and tests and add your name to the package.json file.
We try to follow [Airbnb's JavaScript Style Guide](https://github.com/airbnb/javascript).

## License

MIT
