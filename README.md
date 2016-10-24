# Serverless Offline Plugin
[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com)
[![npm version](https://badge.fury.io/js/serverless-offline.svg)](https://badge.fury.io/js/serverless-offline)

This [Serverless](https://github.com/serverless/serverless) plugin emulates AWS λ and API Gateway on your local machine to speed up your development cycles.
To do so, it starts an HTTP server that handles the request's lifecycle like API does and invokes your handlers.

**Features:**
- Nodejs λ only.
- Velocity templates support.
- Timeouts according to your configuration files.
- Lazy loading of your files with require cache invalidation: no need for a reloading tool like Nodemon.
- And more: responseParameters, HTTPS, Babel runtime, CORS, CoffeeScript, etc...

## Documentation

- [Installation](https://github.com/dherault/serverless-offline#installation)
- [Usage and command line options](https://github.com/dherault/serverless-offline#usage-and-command-line-options)
- [Usage with Babel](https://github.com/dherault/serverless-offline#usage-with-babel)
- [Usage with CoffeeScript](https://github.com/dherault/serverless-offline#usage-with-coffeescript)
- [Custom authorizers](https://github.com/dherault/serverless-offline#custom-authorizers)
- [Response parameters](https://github.com/dherault/serverless-offline#response-parameters)
- [Using Velocity Templates for API Gateway](https://github.com/dherault/serverless-offline#using-velocity-templates-for-api-gateway)
- [Debug process](https://github.com/dherault/serverless-offline#debug-process)
- [Simulation quality](https://github.com/dherault/serverless-offline#simulation-quality)
- [Velocity nuances](https://github.com/dherault/serverless-offline#velocity-nuances)
- [Credits and inspiration](https://github.com/dherault/serverless-offline#credits-and-inspiration)
- [Contributing](https://github.com/dherault/serverless-offline#contributing)
- [License](https://github.com/dherault/serverless-offline#license)

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

the console should display *Offline* as one of the plugins now available in your Serverless project.

## Usage and command line options

In your project root run:

`serverless offline` or `sls offline`.

to list all the options for the plugin run:

`sls offline --help`

All CLI options are optional:

```
--prefix                -p  Adds a prefix to every path, to send your requests to http://localhost:3000/[prefix]/[your_path] instead. E.g. -p dev
--host                  -o  Host name to listen on. Default: localhost
--port                  -P  Port to listen on. Default: 3000
--stage                 -s  The stage used to populate your templates. Default: the first stage found in your project.
--region                -r  The region used to populate your templates. Default: the first region for the first stage found.
--noTimeout             -t  Disables the timeout feature.
--dontPrintOutput           Turns of logging of your lambda outputs in the terminal.
--httpsProtocol         -H  To enable HTTPS, specify directory (relative to your cwd, typically your project dir) for both cert.pem and key.pem files.
--skipCacheInvalidation -c  Tells the plugin to skip require cache invalidation. A script reloading tool like Nodemon might then be needed.
--corsAllowOrigin           Used to build the Access-Control-Allow-Origin header for all responses.  Delimit multiple values with commas. Default: '*'
--corsAllowHeaders          Used to build the Access-Control-Allow-Headers header for all responses.  Delimit multiple values with commas. Default: 'accept,content-type,x-api-key'
--corsDisallowCredentials   When provided, the Access-Control-Allow-Credentials header will be passed as 'false'. Default: true
```

By default you can send your requests to `http://localhost:3000/`. Please note that:

- You'll need to restart the plugin if you modify your `serverless.yml` or any of the default velocity template files.
- The event object passed to your λs has one extra key: `{ isOffline: true }`. Also, `process.env.IS_OFFLINE` is `true`.
- When no Content-Type header is set on a request, API Gateway defaults to `application/json`, and so does the plugin.
But if you send a `application/x-www-form-urlencoded` or a `multipart/form-data` body with a `application/json` (or no) Content-Type, API Gateway won't parse your data (you'll get the ugly raw as input) whereas the plugin will answer 400 (malformed JSON).
Please consider explicitly setting your requests' Content-Type and using separates templates.

## Usage with Babel

You can use Offline with [Serverless-runtime-babel](https://github.com/serverless/serverless-runtime-babel).
To do so you need to install (at least) the es2015 preset in your project folder (`npm i babel-preset-es2015 --save-dev`).

~ Or ~

Your λ handlers can be required with `babel-register`.
To do so, in your `serverless.yml` file, set options to be passed to babel-register like this:
```yml
custom:
  serverless-offline:
    babelOptions:
      presets: ["es2015", "stage-2"]
```

Here is the full list of [babel-register options](https://babeljs.io/docs/usage/require/)


## Usage with CoffeeScript

You can have `handler.coffee` instead of `handler.js`. No additional configuration is needed.


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

## Response parameters

You can set your response's headers using ResponseParameters. See the [APIG docs](http://docs.aws.amazon.com/apigateway/latest/developerguide/request-response-data-mappings.html#mapping-response-parameters).

Example:
```javascript
"responseParameters": {
  "method.response.header.X-Powered-By": "Serverless", // a string
  "method.response.header.Warning": "integration.response.body", // the whole response
  "method.response.header.Location": "integration.response.body.some.key" // a pseudo JSON-path
},
```
## Using Velocity Templates for API Gateway

The API Gateway uses velocity markup templates (https://en.wikipedia.org/wiki/Apache_Velocity) for customization of request and responses. Serverless offline plugin can mimick this and the templates can be provided either globally or per function.
The default templates are located in the *src* path of the project. The default request template is located in file `offline-default.req.vm` and the default response template is located in `offline-default.res.vm`.

In addition, you can supply response and request templates for each function. This is optional. To do so you will have to place function specific template files in the same directory as your function file and add the .req.vm extension to the template filename.
For example:
if your function is in code-file: `helloworld.js`
your response template should be in file: `helloworld.res.vm` and your request template in file `helloworld.req.vm`.

## Debug process

Serverless offline plugin will respond to the overall framework settings and output additional information to the console in debug mode. In order to do this you will have to set the `SLS_DEBUG` environmental variable. You can run the following in the command line to switch to debug mode execution.

>Unix:  `export SLS_DEBUG=*`

>Windows: `SET SLS_DEBUG=*`

Interactive debugging is also possible for your project if you have installed the node-inspector module and chrome browser. You can then run the following command line inside your project's root.

Initial intallation:
`npm install -g node-inspector`

For each debug run:
`node-debug sls offline`

The system will start in wait status. This will also automatically start the chrome browser and wait for you to set breakpoints for inspection. Set the breakpoints as needed and, then, click the play button for the debugging to continue.

Depending on the breakpoint, you may need to call the URL path for your function in seperate browser window for your serverless function to be run and made available for debugging.


## Simulation quality

This plugin simulates API Gateway for many practical purposes, good enough for development - but is not a perfect simulator.
Specifically, Lambda currently runs on Node v4.3.2, whereas *Offline* runs on your own runtime where no memory limits are enforced.


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


## Credits and inspiration

This plugin was initially a fork of [Nopik](https://github.com/Nopik/)'s [Serverless-serve](https://github.com/Nopik/serverless-serve).


## Contributing

Yes, thanks you! Please update the docs accordingly. There is no test suite or linting for this project. We try to follow [Airbnb's JavaScript Style Guide](https://github.com/airbnb/javascript).


## License

MIT
