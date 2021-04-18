import debugLog from '../debugLog.js'
import { logWarning } from '../serverlessLog.js'

export default function getHttpApiCorsConfig(httpApiCors) {
  if (httpApiCors === true) {
    // default values that should be set by serverless
    // https://www.serverless.com/framework/docs/providers/aws/events/http-api/
    const c = {
      allowedOrigins: ['*'],
      allowedHeaders: [
        'Content-Type',
        'X-Amz-Date',
        'Authorization',
        'X-Api-Key',
        'X-Amz-Security-Token',
        'X-Amz-User-Agent',
      ],
      allowedMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    }
    debugLog(c)
    logWarning(c)
    return c
  }
  debugLog(httpApiCors)
  logWarning(httpApiCors)
  return httpApiCors
}
