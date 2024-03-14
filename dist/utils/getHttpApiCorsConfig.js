import { log } from '@serverless/utils/log.js'
export default function getHttpApiCorsConfig(httpApiCors) {
  if (httpApiCors === true) {
    const c = {
      allowedHeaders: [
        'Authorization',
        'Content-Type',
        'X-Amz-Date',
        'X-Amz-Security-Token',
        'X-Amz-User-Agent',
        'X-Api-Key',
      ],
      allowedMethods: ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
      allowedOrigins: ['*'],
    }
    log.debug('Using CORS policy', c)
    return c
  }
  log.debug('Using CORS policy', httpApiCors)
  return httpApiCors
}
