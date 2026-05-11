export default {
  albPort: {
    type: "string",
    usage: "ALB port to listen on. Default: 3003.",
  },
  corsAllowHeaders: {
    type: "string",
    usage:
      "Used to build the Access-Control-Allow-Headers header for CORS support.",
  },
  corsAllowOrigin: {
    type: "string",
    usage:
      "Used to build the Access-Control-Allow-Origin header for CORS support.",
  },
  corsDisallowCredentials: {
    type: "boolean",
    usage:
      "Used to override the Access-Control-Allow-Credentials default (which is true) to false.",
  },
  corsExposedHeaders: {
    type: "string",
    usage:
      "Used to build the Access-Control-Exposed-Headers response header for CORS support.",
  },
  disableCookieValidation: {
    type: "boolean",
    usage: "Used to disable cookie-validation on hapi.js-server.",
  },
  dockerHost: {
    type: "string",
    usage: "The host name of Docker. Default: localhost.",
  },
  dockerHostServicePath: {
    type: "string",
    usage:
      "Defines service path which is used by SLS running inside Docker container.",
  },
  dockerNetwork: {
    type: "string",
    usage: "The network that the Docker container will connect to.",
  },
  dockerReadOnly: {
    type: "boolean",
    usage: "Marks if the docker code layer should be read only. Default: true.",
  },
  enforceSecureCookies: {
    type: "boolean",
    usage: "Enforce secure cookies.",
  },
  host: {
    shortcut: "o",
    type: "string",
    usage: "The host name to listen on. Default: localhost.",
  },
  httpPort: {
    type: "string",
    usage: "HTTP port to listen on. Default: 3000.",
  },
  httpsProtocol: {
    shortcut: "H",
    type: "string",
    usage:
      "To enable HTTPS, specify directory (relative to your cwd, typically your project dir) for both cert.pem and key.pem files.",
  },
  ignoreJWTSignature: {
    type: "boolean",
    usage:
      "When using HttpApi with a JWT authorizer, don't check the signature of the JWT token.",
  },
  lambdaPort: {
    type: "string",
    usage: "Lambda http port to listen on. Default: 3002.",
  },
  layersDir: {
    type: "string",
    usage:
      "The directory layers should be stored in. Default: {codeDir}/.serverless-offline/layers.",
  },
  localEnvironment: {
    type: "boolean",
    usage: "Copy local environment variables. Default: false.",
  },
  noAuth: {
    type: "boolean",
    usage: "Turns off all authorizers.",
  },
  noPrependStageInUrl: {
    type: "boolean",
    usage: "Don't prepend http routes with the stage.",
  },
  noSponsor: {
    type: "boolean",
    usage: "Remove sponsor message from the output.",
  },
  noTimeout: {
    shortcut: "t",
    type: "boolean",
    usage: "Disables the timeout feature.",
  },
  prefix: {
    shortcut: "p",
    type: "string",
    usage:
      "Adds a prefix to every path, to send your requests to http://localhost:3000/prefix/[your_path] instead.",
  },
  preLoadModules: {
    type: "string",
    usage: "A comma separated list of modules to preload on the main thread",
  },
  reloadHandler: {
    type: "boolean",
    usage: "Reloads handler with each request.",
  },
  resourceRoutes: {
    type: "boolean",
    usage: "Turns on loading of your HTTP proxy settings from serverless.yml.",
  },
  terminateIdleLambdaTime: {
    type: "string",
    usage:
      "Number of seconds until an idle function is eligible for termination.",
  },
  useDocker: {
    type: "boolean",
    usage: "Uses docker for node/python/ruby/provided.",
  },
  useInProcess: {
    type: "boolean",
    usage: "Run handlers in the same process as 'serverless-offline'.",
  },
  webSocketHardTimeout: {
    type: "string",
    usage:
      "Set WebSocket hard timeout in seconds to reproduce AWS limits (https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html#apigateway-execution-service-websocket-limits-table). Default: 7200 (2 hours).",
  },
  webSocketIdleTimeout: {
    type: "string",
    usage:
      "Set WebSocket idle timeout in seconds to reproduce AWS limits (https://docs.aws.amazon.com/apigateway/latest/developerguide/limits.html#apigateway-execution-service-websocket-limits-table). Default: 600 (10 minutes).",
  },
  websocketPort: {
    type: "string",
    usage: "Websocket port to listen on. Default: 3001.",
  },
}
