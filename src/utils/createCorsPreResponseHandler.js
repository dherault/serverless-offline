import getHttpApiCorsConfig from "./getHttpApiCorsConfig.js"

const { entries } = Object

// creates an 'onPreResponse' extension adding the CORS headers to the
// responses, and answering the CORS preflight requests, of a hapi server
export default function createCorsPreResponseHandler(serverless) {
  return function corsPreResponseHandler(request, h) {
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
        )

        if (request.method === "options") {
          response.statusCode = 204
        }

        const allowAllOrigins =
          httpApiCors.allowedOrigins.length === 1 &&
          httpApiCors.allowedOrigins[0] === "*"

        // like API Gateway, don't let another origin read any response, not
        // only the preflight ones: a simple request isn't preceded by one
        if (
          !allowAllOrigins &&
          !httpApiCors.allowedOrigins.includes(request.headers.origin)
        ) {
          return h.continue
        }

        response.headers["access-control-allow-origin"] = request.headers.origin
        if (httpApiCors.allowCredentials) {
          response.headers["access-control-allow-credentials"] = "true"
        }
        if (httpApiCors.maxAge) {
          response.headers["access-control-max-age"] = httpApiCors.maxAge
        }
        if (httpApiCors.exposedResponseHeaders) {
          response.headers["access-control-expose-headers"] =
            httpApiCors.exposedResponseHeaders.join(",")
        }
        if (httpApiCors.allowedMethods) {
          response.headers["access-control-allow-methods"] =
            httpApiCors.allowedMethods.join(",")
        }
        if (httpApiCors.allowedHeaders) {
          response.headers["access-control-allow-headers"] =
            httpApiCors.allowedHeaders.join(",")
        }
      } else {
        response.headers["access-control-allow-origin"] = request.headers.origin
        response.headers["access-control-allow-credentials"] = "true"

        if (request.method === "options") {
          response.statusCode = 200

          response.headers["access-control-expose-headers"] =
            request.headers["access-control-expose-headers"] ||
            "content-type, content-length, etag"
          response.headers["access-control-max-age"] = 60 * 10

          if (request.headers["access-control-request-headers"]) {
            response.headers["access-control-allow-headers"] =
              request.headers["access-control-request-headers"]
          }

          if (request.headers["access-control-request-method"]) {
            response.headers["access-control-allow-methods"] =
              request.headers["access-control-request-method"]
          }
        }

        // Override default headers with headers that have been explicitly set
        entries(explicitlySetHeaders).forEach(([key, value]) => {
          if (value) {
            response.headers[key] = value
          }
        })
      }
    }
    return h.continue
  }
}
