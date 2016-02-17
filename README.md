# Serverless Offline Plugin

When developing with Serverless deploying functions to AWS after each change might be annoying. This plugin allows you to simulate API Gateway locally, so all function calls can be done on localhost.

### Differences with Serverless-serve-plugin

See 'Credits and inspiration'.

### Requierements

Node v4 and over.

### Installation

In your Serverless project:

```
npm install serverless-offline
```

Then in `s-project.json` add following entry to the plugins array: `serverless-offline`

Like this:
```
  "plugins": ["serverless-offline"]
```

And in main project root do:

```
sls offline start
```

### Command line options

`--prefix` `-p`: Add prefix to the URLs, so your clients will not use `http://localhost:3000/` but `http://localhost:3000/prefix/` instead. Default: empty

`--port` `-P`: Port to listen on. Default: `3000`


### Usage

Just send your requests to `http://localhost:3000/` as it would be API Gateway.

Using this plugin with [Nodemon](https://github.com/remy/nodemon) is advised to reload your local code after every change.

### Usage with Babel

Optionaly, your handlers can be required with `babel-register`.
To do so, in your `s-project.json` file, set options to be passed to babel-register like this:
```
{
  /* ... */
  "custom": {
    "serverless-offline": {
      "babelOptions": {
        /* Your own options, example: */
        presets: ["es2015", "stage-2"]
      }
    }
  },
  "plugins": ["serverless-offline", /* ... */]
}
```
To view the full list of babel-register options, click [here](https://babeljs.io/docs/usage/require/)

### Simulation quality

This plugin simulates API Gateway for many practical purposes, good enough for development - but is not a perfect simulator. Specifically, Lambda currently runs on Node v0.10.13, whereas *offline* runs on your own runtime where no timeout or memory limits are enforced. Mapping templates are not simulated, so are security checks. You will probably find other differences.

### Credits and inspiration

This plugin is a fork of [Nopik](https://github.com/Nopik/)'s [Serverless-serve](https://github.com/Nopik/serverless-serve), the differences are:

- Under the hood, *Serve* uses Express, *Offline* uses Hapi.
- *Serve*'s `event` object (passed to your handlers) is undocumented ad often empty. *Offline*'s `event` object is defined by: `Object.assign({ isServerlessOffline: true }, request);` where `request` is [Hapi's request object](http://hapijs.com/api#request-object). This allows you to quickly access properties like the request's params or payload in your lambda handler:
```javascript
module.exports.handler = function(event, context) {
 +  var params;
 +  
 +  if (event.isServerlessOffline) { // Offline
 +    params = event.params;
 +  } else { // Online
 +    /* Define your event object using a template in your s-function.json file */
 +    params = event.customKeyDefinedInTemplate;
 +  }
 +};
```
- *Serve* will pick the first non `default` response of an endpoint if `errorPattern` is undefined. Doing so, it neglects the `default` answer (so it does not work out of the box with `serverless project create`). This causes new projects to answer 400 using *Serve*.
Example :
```javascript
"responses": {
  "400": {
    "statusCode": "400" // errorPattern is undefined: Serve will always answer 400
  },
  "default": {
    "statusCode": "200",
    "responseParameters": {},
    "responseModels": {},
    "responseTemplates": {
      "application/json": ""
    }
  }
}
```
- *Offline* dropped support for *Serve*'s optional init script for now.

### Licence

MIT
