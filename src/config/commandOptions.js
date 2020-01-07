export default {
  apiKey: {
    usage:
      'Defines the API key value to be used for endpoints marked as private. Defaults to a random hash.',
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
  hideStackTraces: {
    usage: 'Hide the stack trace on lambda failure. Default: false',
  },
  host: {
    shortcut: 'o',
    usage: 'The host name to listen on. Default: localhost',
  },
  httpPort: {
    usage: 'HTTP port to listen on. Default: 3000',
  },
  httpsProtocol: {
    shortcut: 'H',
    usage:
      'To enable HTTPS, specify directory (relative to your cwd, typically your project dir) for both cert.pem and key.pem files.',
  },
  lambdaPort: {
    usage: 'Lambda http port to listen on. Default: 3002',
  },
  noAuth: {
    usage: 'Turns off all authorizers',
  },
  noTimeout: {
    shortcut: 't',
    usage: 'Disables the timeout feature.',
  },
  printOutput: {
    usage: 'Outputs your lambda response to the terminal.',
  },
  resourceRoutes: {
    usage: 'Turns on loading of your HTTP proxy settings from serverless.yml.',
  },
  useChildProcesses: {
    usage: 'Uses separate node processes for handlers',
  },
  useWorkerThreads: {
    usage:
      'Uses worker threads for handlers. Requires node.js v11.7.0 or higher',
  },
  websocketPort: {
    usage: 'Websocket port to listen on. Default: 3001',
  },
  useDocker: {
    usage: 'Uses docker for node/python/ruby',
  },
}
