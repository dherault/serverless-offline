# Serverless Offline Plugin

**Now comptatible with Serverless 0.5!** See [this branch](https://github.com/dherault/serverless-offline/tree/serverless_0.5).

This [Serverless](https://github.com/serverless/serverless) plugin emulates AWS API Gateway and Lambda locally to speed up your development cycles.

### Features

- Call your Nodejs λs on localhost the same way you would call API Gateway.
- requestTemplates and responseTemplates Velocity support.
- Timeouts according to your `s-function.json` files (the plugin responds 503).
- Overkill error handling: reproduces API Gateway's errors, displays stack traces on terminal.
- Lazy loading of your λs: modify them, don't restart the plugin, enjoy your changes (the `require` cache is invalidated on each λ invocation, no need for a reloading tool like Nodemon).
- Support for HTTPS protocol.
- Support for CoffeeScript λ handlers.

### Installation

Requires Serverless v0.4.x. In your Serverless project root:

```
npm install serverless-offline
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

All CLI options are optionnal.

`--prefix` `-p`: Add prefix to the URLs, so your clients will not use `http://localhost:3000/` but `http://localhost:3000/prefix/` instead. Default: none.

`--port` `-P`: Port to listen on. Default: 3000.

`--stage` `-s`: The stage used to populate your velocity templates. Default: the first stage found in your project.

`--region` `-r`: The region used to populate your velocity templates. Default: the first region for the first stage found in your project.

`--httpsProtocol` `-h`: To enable HTTPS, specify directory (relative to Serverless project root) for both `cert.pem` and `key.pem` files. E.g. `-h ./certs`. Default: none.

`--skipRequireCacheInvalidation` `-c`: Tells the plugin to skip require cache invalidation. A script reloading tool like Nodemon might then be needed. Default: false.

`--debugOffline`: Prints debug messages. Can be useful to see how your templates are processed.

### Usage

Just send your requests to `http://localhost:3000/` as it would be API Gateway. Please note that:
- The first request for each handler might take a few more seconds, but timeouts are calculated from your handlers' execution only.
- You'll need to restart the plugin if you modify your `s-function.json` or `s-templates.json` files, other files are lazy loaded.
- When no Content-Type header is set on a request, API Gateway defaults to `application/json`, and so does the plugin.
But if you send a `application/x-www-form-urlencoded` or a `multipart/form-data` body with a `application/json` (or no) Content-Type, API Gateway won't parse your data (you'll get the ugly raw as input) whereas the plugin will answer 400 (malformed JSON).
Please consider explicitly setting your requests' Content-Type and using separates templates.
- The event object passed to your λs has one extra key: `{ isOffline: true }`.

### Usage with Babel

Optionaly, your λ handlers can be required with `babel-register` to support ES6/ES7 features.
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

### Usage with CoffeeScript

You can have `handler.coffee` instead of `handler.js`. No additional configuration is needed.

### Simulation quality

This plugin simulates API Gateway for many practical purposes, good enough for development - but is not a perfect simulator. 
Specifically, Lambda currently runs on Node v0.10.13, whereas *Offline* runs on your own runtime where no memory limits are enforced. 
security checks are not simulated. You will probably find other differences.

### Velocity nuances

Currently, the main difference between the JavaScript Velocity parser this plugin uses and AWS's parser is how they handle types:

Consider this requestTemplate for a POST endpoint:
```json
"application/json": {
  "payload": "$input.json('$')",
  "id_json": "$input.json('$.id')",
  "id_path": "$input.path('$').id"
}
```

Now let's make a request with this body:
```json
{
 "id": 1
}
```

AWS parses the event as such:
```javascript
{
  "payload": {
    "id": 1
  },
  "id_json": 1,
  "id_path": "1" // String type
}
```

Whereas Offline parses:
```javascript
{
  "payload": {
    "id": 1
  },
  "id_json": 1,
  "id_path": 1, // Number type
  "isOffline": true
}
```

Accessing an attribute after using $input.path will return a string on AWS (expect strings like `"1"` or `"true"`) but not with Offline (`1` or `true`).

### Credits and inspiration

This plugin is a fork of [Nopik](https://github.com/Nopik/)'s [Serverless-serve](https://github.com/Nopik/serverless-serve), the main differences are:

- *Offline* supports Velocity templates.
- *Offline* takes into account your λ's timeouts.
- *Offline* puts a stronger focus on error handling by displaying stack traces and mimicking APIG's errors.
- *Offline* has an open-source license.
- Under the hood, *Serve* uses Express, *Offline* uses Hapi.

### Roadmap

- Reduce initial loading time
- v2.0.0 when Serverless 0.5 is out
- Support for Python and Java runtimes
- Test suite

### Contributing

Yes, thanks a lot!

### License

MIT
