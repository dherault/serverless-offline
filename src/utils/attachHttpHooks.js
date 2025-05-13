import getHttpApiCorsConfig from './getHttpApiCorsConfig.js'

export default function attachHttpHooks(server, serverless) {
  // Enable CORS preflight response
  server.ext('onPreResponse', (request, h) => {
    if (request.headers.origin) {
      const response = request.response.isBoom
        ? request.response.output
        : request.response

      const explicitlySetHeaders = {
        ...response.headers,
      }

      if (
        serverless.service.provider.httpApi &&
        serverless.service.provider.httpApi.cors
      ) {
        const httpApiCors = getHttpApiCorsConfig(
          serverless.service.provider.httpApi.cors,
          this,
        )

        if (request.method === 'options') {
          response.statusCode = 204
          const allowAllOrigins =
            httpApiCors.allowedOrigins.length === 1 &&
            httpApiCors.allowedOrigins[0] === '*'
          if (
            !allowAllOrigins &&
            !httpApiCors.allowedOrigins.includes(request.headers.origin)
          ) {
            return h.continue
          }
        }

        response.headers['access-control-allow-origin'] = request.headers.origin
        if (httpApiCors.allowCredentials) {
          response.headers['access-control-allow-credentials'] = 'true'
        }
        if (httpApiCors.maxAge) {
          response.headers['access-control-max-age'] = httpApiCors.maxAge
        }
        if (httpApiCors.exposedResponseHeaders) {
          response.headers['access-control-expose-headers'] =
            httpApiCors.exposedResponseHeaders.join(',')
        }
        if (httpApiCors.allowedMethods) {
          response.headers['access-control-allow-methods'] =
            httpApiCors.allowedMethods.join(',')
        }
        if (httpApiCors.allowedHeaders) {
          response.headers['access-control-allow-headers'] =
            httpApiCors.allowedHeaders.join(',')
        }
      } else {
        response.headers['access-control-allow-origin'] = request.headers.origin
        response.headers['access-control-allow-credentials'] = 'true'

        if (request.method === 'options') {
          response.statusCode = 200

          if (request.headers['access-control-expose-headers']) {
            response.headers['access-control-expose-headers'] =
              request.headers['access-control-expose-headers']
          } else {
            response.headers['access-control-expose-headers'] =
              'content-type, content-length, etag'
          }
          response.headers['access-control-max-age'] = 60 * 10

          if (request.headers['access-control-request-headers']) {
            response.headers['access-control-allow-headers'] =
              request.headers['access-control-request-headers']
          }

          if (request.headers['access-control-request-method']) {
            response.headers['access-control-allow-methods'] =
              request.headers['access-control-request-method']
          }
        }

        // Override default headers with headers that have been explicitly set
        Object.entries(explicitlySetHeaders).forEach(([key, value]) => {
          if (value) {
            response.headers[key] = value
          }
        })
      }
    }
    return h.continue
  })
}
