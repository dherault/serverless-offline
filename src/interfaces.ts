export interface CliOptions {
  apiKey?: string
  corsAllowCredentials?: string
  corsAllowHeaders?: string
  corsAllowOrigin?: string
  corsExposedHeaders?: string
  disableCookieValidation?: string
  enforceSecureCookies?: string
  hideStackTraces?: string
  host?: string
  httpsProtocol?: string
  lambdaPort?: string
  location?: string
  noAuth?: string
  noTimeout?: string
  port?: string
  printOutput?: string
  resourceRoutes?: string
  useChildProcesses?: string
  useWorkerThreads?: string
  websocketPort?: string
}

export interface Options {
  apiKey?: string
  corsAllowCredentials?: boolean
  corsAllowHeaders?: string
  corsAllowOrigin?: string
  corsExposedHeaders?: string
  disableCookieValidation?: boolean
  enforceSecureCookies?: boolean
  hideStackTraces?: boolean
  host?: string
  httpsProtocol?: string
  lambdaPort?: number
  location?: string
  noAuth?: boolean
  noTimeout?: boolean
  port?: number
  printOutput?: boolean
  resourceRoutes?: boolean
  useChildProcesses?: boolean
  useWorkerThreads?: boolean
  websocketPort?: number
}
