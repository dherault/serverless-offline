# Serverless Offline Plugin

This [Serverless](https://github.com/serverless/serverless) plugin emulates AWS API Gateway and Lambda locally to speed up your development cycles.

### V1 Beta

The new v1 beta supports velocity parsing of your requestTemplates and responseTemplates!
Check it out on the [v1.0.0 branch](https://github.com/dherault/serverless-offline/tree/v1.0.0).

### Features

- Call your λs on localhost the same way you would call API Gateway.
- The `event` object passed to your λ is [Hapijs's request object](http://hapijs.com/api#request-object) (for now, we're going with full velocity templates support ASAP).
- Timeouts according to your `s-function.json` files (the plugin responds 503).
- Overkill error handling: reproduces API Gateway's errors, displays stack traces on terminal.
- Lazy loading of your λs: modify them, don't restart the plugin, enjoy your changes (the `require` cache is invalidated on each λ invocation, no need for a reloading tool like Nodemon).

### Installation

Requires Node v4 and over and Serverless v0.4.x. In your Serverless project:

```
npm install serverless-offline@0.2.4
```

Then in `s-project.json` add following entry to the plugins array: `serverless-offline`

Like this:
```
  "plugins": ["serverless-offline"]
```

And in your project root run:

```
sls offline start
```

### Command line options

`--prefix` `-p`: Add prefix to the URLs, so your clients will not use `http://localhost:3000/` but `http://localhost:3000/prefix/` instead. Default: empty

`--port` `-P`: Port to listen on. Default: `3000`

`--useTemplates` `-t`: experimental feature: use the templates of your endpoints to populate the event object passed to your λ.


### Usage

Just send your requests to `http://localhost:3000/` as it would be API Gateway.

### Usage with Babel

Optionaly, your λ handlers can be required with `babel-register`.
To do so, in your `s-project.json` file, set options to be passed to babel-register like this:
```javascript
{
  /* ... */
  "custom": {
    "serverless-offline": {
      "babelOptions": {
        /* Your own options, example: */
        "presets": ["es2015", "stage-2"]
      }
    }
  },
  "plugins": ["serverless-offline", /* ... */]
}
```
Here is the full list of [babel-register options](https://babeljs.io/docs/usage/require/)

### The `event` object

Offline's `event` object is defined by: `Object.assign({ isServerlessOffline: true }, request);` where `request` is [Hapi's request object](http://hapijs.com/api#request-object). This allows you to quickly access properties like the request's params or payload in your lambda handler:
```javascript
module.exports.handler = function(event, context) {
  var params;
  
  if (event.isServerlessOffline) { // Locally, or you can check for process.env.AWS_LAMBDA_FUNCTION_NAME's absence
    /* Hapijs request object */
    params = event.params;
  } else { // On AWS Lambda
    /* Define your event object using a template in your s-function.json file */
    params = event.customKeyDefinedInTemplate;
  }
};
```
### Simulation quality

This plugin simulates API Gateway for many practical purposes, good enough for development - but is not a perfect simulator. 
Specifically, Lambda currently runs on Node v0.10.13, whereas *Offline* runs on your own runtime where no memory limits are enforced. 
Mapping templates are not simulated, so are security checks. You will probably find other differences.

### Credits and inspiration

This plugin is a fork of [Nopik](https://github.com/Nopik/)'s [Serverless-serve](https://github.com/Nopik/serverless-serve), the differences are:

- Under the hood, *Serve* uses Express, *Offline* uses Hapi.
- *Offline* puts a stronger focus on error handling by displaying stack traces and mimicking APIG's errors.
- *Serve*'s `event` object (passed to your handlers) is undocumented and often empty.
- *Offline* dropped support for *Serve*'s optional init script.
- *Offline* takes into account your λ's timeouts.
- *Offline* displays your routes on start.
- *Offline* has some kind of testing.
- *Offline* has an open-source license.

### Roadmap

Once Serverless 0.5 is out, support for velocity templates to define the event object and modify your functions' output.

### Contributing

PRs are welcome :)

### Licence

MIT
