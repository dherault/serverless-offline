export default {
  apiKey: {
    usage:
      'Defines the API key value to be used for endpoints marked as private. Defaults to a random hash.',
    type: 'string',
  },
  corsAllowHeaders: {
    usage:
      'Used to build the Access-Control-Allow-Headers header for CORS support.',
    type: 'string',
  },
  corsAllowOrigin: {
    usage:
      'Used to build the Access-Control-Allow-Origin header for CORS support.',
    type: 'string',
  },
  corsDisallowCredentials: {
    usage:
      'Used to override the Access-Control-Allow-Credentials default (which is true) to false.',
    type: 'boolean',
  },
  corsExposedHeaders: {
    usage:
      'Used to build the Access-Control-Exposed-Headers response header for CORS support',
    type: 'string',
  },
  disableCookieValidation: {
    usage: 'Used to disable cookie-validation on hapi.js-server',
    type: 'boolean',
  },
  enforceSecureCookies: {
    usage: 'Enforce secure cookies',
    type: 'boolean',
  },
  hideStackTraces: {
    usage: 'Hide the stack trace on lambda failure. Default: false',
    type: 'boolean',
  },
  host: {
    shortcut: 'o',
    usage: 'The host name to listen on. Default: localhost',
    type: 'string',
  },
  httpPort: {
    usage: 'HTTP port to listen on. Default: 3000',
    type: 'string',
  },
  httpsProtocol: {
    shortcut: 'H',
    usage:
      'To enable HTTPS, specify directory (relative to your cwd, typically your project dir) for both cert.pem and key.pem files.',
    type: 'string',
  },
  lambdaPort: {
    usage: 'Lambda http port to listen on. Default: 3002',
    type: 'string',
  },
  noPrependStageInUrl: {
    usage: "Don't prepend http routes with the stage.",
    type: 'boolean',
  },
  noStripTrailingSlashInUrl: {
    usage: "Don't strip trailing slash from http routes.",
    type: 'boolean',
  },
  noAuth: {
    usage: 'Turns off all authorizers',
    type: 'boolean',
  },
  ignoreJWTSignature: {
    usage:
      "When using HttpApi with a JWT authorizer, don't check the signature of the JWT token. This should only be used for local development.",
    type: 'boolean',
  },
  noTimeout: {
    shortcut: 't',
    usage: 'Disables the timeout feature.',
    type: 'boolean',
  },
  prefix: {
    shortcut: 'p',
    usage:
      'Adds a prefix to every path, to send your requests to http://localhost:3000/prefix/[your_path] instead.',
    type: 'string',
  },
  printOutput: {
    usage: 'Outputs your lambda response to the terminal.',
    type: 'boolean',
  },
  resourceRoutes: {
    usage: 'Turns on loading of your HTTP proxy settings from serverless.yml.',
    type: 'boolean',
  },
  useChildProcesses: {
    usage: 'Uses separate node processes for handlers',
    type: 'boolean',
  },
  useWorkerThreads: {
    usage:
      'Uses worker threads for handlers. Requires node.js v11.7.0 or higher',
    type: 'boolean',
  },
  websocketPort: {
    usage: 'Websocket port to listen on. Default: 3001',
    type: 'string',
  },
  webSocketHardTimeout: {
    usage:
      'Set WebSocket hard timeout in seconds to reproduce AWS limits (https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html#apigateway-execution-service-websocket-limits-table). Default: 7200 (2 hours)',
    type: 'string',
  },
  webSocketIdleTimeout: {
    usage:
      'Set WebSocket idle timeout in seconds to reproduce AWS limits (https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html#apigateway-execution-service-websocket-limits-table). Default: 600 (10 minutes)',
    type: 'string',
  },
  useDocker: {
    usage: 'Uses docker for node/python/ruby/provided',
    type: 'boolean',
  },
  layersDir: {
    usage:
      'The directory layers should be stored in. Default: {codeDir}/.serverless-offline/layers',
    type: 'string',
  },
  dockerReadOnly: {
    usage: 'Marks if the docker code layer should be read only. Default: true',
    type: 'boolean',
  },
  functionCleanupIdleTimeSeconds: {
    usage: 'Number of seconds until an idle function is eligible for cleanup',
    type: 'string',
  },
  allowCache: {
    usage: 'Allows the code of lambda functions to cache if supported',
    type: 'boolean',
  },
  dockerHost: {
    usage: 'The host name of Docker. Default: localhost',
    type: 'string',
  },
  dockerHostServicePath: {
    usage:
      'Defines service path which is used by SLS running inside Docker container',
    type: 'string',
  },
  dockerNetwork: {
    usage: 'The network that the Docker container will connect to',
    type: 'string',
  },
}
