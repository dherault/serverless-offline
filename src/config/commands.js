const { createDefaultApiKey } = require('../utils/index.js');

module.exports = {
  offline: {
    // add start nested options
    commands: {
      start: {
        lifecycleEvents: ['init', 'end'],
        usage:
          'Simulates API Gateway to call your lambda functions offline using backward compatible initialization.',
      },
    },
    lifecycleEvents: ['start'],
    options: {
      apiKey: {
        default: createDefaultApiKey(),
        usage:
          'Defines the API key value to be used for endpoints marked as private. Defaults to a random hash.',
      },
      binPath: {
        shortcut: 'b',
        usage: 'Path to the Serverless binary.',
      },
      cacheInvalidationRegex: {
        default: 'node_modules',
        usage:
          'Provide the plugin with a regexp to use for cache invalidation. Default: node_modules',
      },
      corsAllowHeaders: {
        default: 'accept,content-type,x-api-key,authorization',
        usage:
          'Used to build the Access-Control-Allow-Headers header for CORS support.',
      },
      corsAllowOrigin: {
        default: '*',
        usage:
          'Used to build the Access-Control-Allow-Origin header for CORS support.',
      },
      corsDisallowCredentials: {
        usage:
          'Used to override the Access-Control-Allow-Credentials default (which is true) to false.',
      },
      corsExposedHeaders: {
        default: 'WWW-Authenticate,Server-Authorization',
        usage:
          'USed to build the Access-Control-Exposed-Headers response header for CORS support',
      },
      disableCookieValidation: {
        default: false,
        usage: 'Used to disable cookie-validation on hapi.js-server',
      },
      enforceSecureCookies: {
        default: false,
        usage: 'Enforce secure cookies',
      },
      exec: {
        default: '',
        usage:
          'When provided, a shell script is executed when the server starts up, and the server will shut down after handling this command.',
      },
      hideStackTraces: {
        default: false,
        usage: 'Hide the stack trace on lambda failure. Default: false',
      },
      host: {
        default: 'localhost',
        shortcut: 'o',
        usage: 'The host name to listen on. Default: localhost',
      },
      httpsProtocol: {
        default: '',
        shortcut: 'H',
        usage:
          'To enable HTTPS, specify directory (relative to your cwd, typically your project dir) for both cert.pem and key.pem files.',
      },
      location: {
        default: '.',
        shortcut: 'l',
        usage: "The root location of the handlers' files.",
      },
      noAuth: {
        default: false,
        usage: 'Turns off all authorizers',
      },
      noEnvironment: {
        default: false,
        usage:
          'Turns off loading of your environment variables from serverless.yml. Allows the usage of tools such as PM2 or docker-compose.',
      },
      noTimeout: {
        default: false,
        shortcut: 't',
        usage: 'Disables the timeout feature.',
      },
      port: {
        default: 3000,
        shortcut: 'P',
        usage: 'Port to listen on. Default: 3000',
      },
      prefix: {
        default: '/',
        shortcut: 'p',
        usage:
          'Adds a prefix to every path, to send your requests to http://localhost:3000/prefix/[your_path] instead.',
      },
      preserveTrailingSlash: {
        default: false,
        usage: 'Used to keep trailing slashes on the request path',
      },
      printOutput: {
        default: false,
        usage: 'Outputs your lambda response to the terminal.',
      },
      providedRuntime: {
        default: '',
        usage: 'Sets the provided runtime for lambdas',
      },
      region: {
        shortcut: 'r',
        usage: 'The region used to populate your templates.',
      },
      resourceRoutes: {
        default: false,
        usage:
          'Turns on loading of your HTTP proxy settings from serverless.yml.',
      },
      showDuration: {
        default: false,
        usage: 'Show the execution time duration of the lambda function.',
      },
      skipCacheInvalidation: {
        default: false,
        shortcut: 'c',
        usage:
          'Tells the plugin to skip require cache invalidation. A script reloading tool like Nodemon might then be needed',
      },
      stage: {
        shortcut: 's',
        usage: 'The stage used to populate your templates.',
      },
      useSeparateProcesses: {
        default: false,
        usage: 'Uses separate node processes for handlers',
      },
      websocketPort: {
        default: 3001,
        usage: 'Websocket port to listen on. Default: 3001',
      },
    },
    usage: 'Simulates API Gateway to call your lambda functions offline.',
  },
};
