import debugLog from '../debugLog.js'

export default function getHttpApiCorsConfig(httpApiCors, { log }) {
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

    if (log) {
      log.debug('Using CORS policy', c)
    } else {
      debugLog('Using CORS policy', c)
    }
    return c
  }
  if (log) {
    log.debug('Using CORS policy', httpApiCors)
  } else {
    debugLog('Using CORS policy', httpApiCors)
  }

  return httpApiCors
}
