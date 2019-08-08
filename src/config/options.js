'use strict'

module.exports = {
  apiKey: {
    usage:
      'Defines the API key value to be used for endpoints marked as private. Defaults to a random hash.',
  },
  binPath: {
    shortcut: 'b',
    usage: 'Path to the Serverless binary.',
  },
  cacheInvalidationRegex: {
    usage:
      'Provide the plugin with a regexp to use for cache invalidation. Default: node_modules',
  },
  corsAllowHeaders: {
    usage:
      'Used to build the Access-Control-Allow-Headers header for CORS support.',
  },
  corsAllowOrigin: {
    usage:
      'Used to build the Access-Control-Allow-Origin header for CORS support.',
  },
  corsDisallowCredentials: {
    usage:
      'Used to override the Access-Control-Allow-Credentials default (which is true) to false.',
  },
  corsExposedHeaders: {
    usage:
      'USed to build the Access-Control-Exposed-Headers response header for CORS support',
  },
  disableCookieValidation: {
    usage: 'Used to disable cookie-validation on hapi.js-server',
  },
  enforceSecureCookies: {
    usage: 'Enforce secure cookies',
  },
  exec: {
    usage:
      'When provided, a shell script is executed when the server starts up, and the server will shut down after handling this command.',
  },
  hideStackTraces: {
    usage: 'Hide the stack trace on lambda failure. Default: false',
  },
  host: {
    shortcut: 'o',
    usage: 'The host name to listen on. Default: localhost',
  },
  httpsProtocol: {
    shortcut: 'H',
    usage:
      'To enable HTTPS, specify directory (relative to your cwd, typically your project dir) for both cert.pem and key.pem files.',
  },
  location: {
    shortcut: 'l',
    usage: "The root location of the handlers' files.",
  },
  noAuth: {
    usage: 'Turns off all authorizers',
  },
  noEnvironment: {
    usage:
      'Turns off loading of your environment variables from serverless.yml. Allows the usage of tools such as PM2 or docker-compose.',
  },
  noTimeout: {
    shortcut: 't',
    usage: 'Disables the timeout feature.',
  },
  port: {
    shortcut: 'P',
    usage: 'Port to listen on. Default: 3000',
  },
  prefix: {
    shortcut: 'p',
    usage:
      'Adds a prefix to every path, to send your requests to http://localhost:3000/prefix/[your_path] instead.',
  },
  preserveTrailingSlash: {
    usage: 'Used to keep trailing slashes on the request path',
  },
  printOutput: {
    usage: 'Outputs your lambda response to the terminal.',
  },
  providedRuntime: {
    usage: 'Sets the provided runtime for lambdas',
  },
  region: {
    shortcut: 'r',
    usage: 'The region used to populate your templates.',
  },
  resourceRoutes: {
    usage: 'Turns on loading of your HTTP proxy settings from serverless.yml.',
  },
  skipCacheInvalidation: {
    shortcut: 'c',
    usage:
      'Tells the plugin to skip require cache invalidation. A script reloading tool like Nodemon might then be needed',
  },
  stage: {
    shortcut: 's',
    usage: 'The stage used to populate your templates.',
  },
  useSeparateProcesses: {
    usage: 'Uses separate node processes for handlers',
  },
  websocketPort: {
    usage: 'Websocket port to listen on. Default: 3001',
  },
}
