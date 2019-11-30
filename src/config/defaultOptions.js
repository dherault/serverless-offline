import { createDefaultApiKey } from '../utils/index.js'

export default {
  apiKey: createDefaultApiKey(),
  corsAllowCredentials: true, // TODO no CLI option
  corsAllowHeaders: 'accept,content-type,x-api-key,authorization',
  corsAllowOrigin: '*',
  corsExposedHeaders: 'WWW-Authenticate,Server-Authorization',
  disableCookieValidation: false,
  enforceSecureCookies: false,
  hideStackTraces: false,
  host: 'localhost',
  httpsProtocol: '',
  lambdaPort: 3002,
  noAuth: false,
  noTimeout: false,
  port: 3000,
  printOutput: false,
  resourceRoutes: false,
  useChildProcesses: false,
  useWorkerThreads: false,
  websocketPort: 3001,
}
