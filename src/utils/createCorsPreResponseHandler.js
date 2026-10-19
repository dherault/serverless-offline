import getHttpApiCorsConfig from "./getHttpApiCorsConfig.js"

const { entries } = Object

function isOriginAllowed(allowedOrigins, origin) {
  return (
    (allowedOrigins.length === 1 && allowedOrigins[0] === "*") || allowedOrigins.includes(origin)
  )
}

// matches an origin like hapi does with the cors options of a route: in an
// allowed origin with a '*', '*' matches any characters and '?' one character
function isOriginAllowedByHapi(allowedOrigins, origin) {
  return allowedOrigins.some((allowedOrigin) => {
    if (!allowedOrigin.includes("*")) {
      return allowedOrigin === origin
    }

    const pattern = allowedOrigin
      .replaceAll(/[$()*+.?[\\\]^{|}]/g, String.raw`\$&`)
      .replaceAll(String.raw`\*`, ".*")
      .replaceAll(String.raw`\?`, ".")

    return new RegExp(`^${pattern}$`).test(origin)
  })
}

// creates an 'onPreResponse' extension adding the CORS headers to the
// responses, and answering the CORS preflight requests, of a hapi server.
// without provider.httpApi.cors, any origin is allowed, with credentials,
// unless the hapi cors options of the server's routes are given: their
// origins, wildcards included, and credentials are followed then
export default function createCorsPreResponseHandler(serverless, corsConfig) {
  return function corsPreResponseHandler(request, h) {
    if (request.headers.origin) {
      const response = request.response.isBoom ? request.response.output : request.response

      const explicitlySetHeaders = {
        ...response.headers,
      }

      if (serverless.service.provider.httpApi && serverless.service.provider.httpApi.cors) {
        const httpApiCors = getHttpApiCorsConfig(serverless.service.provider.httpApi.cors)

        if (request.method === "options") {
          response.statusCode = 204
        }

        // like API Gateway, don't let another origin read any response, not
        // only the preflight ones: a simple request isn't preceded by one
        if (!isOriginAllowed(httpApiCors.allowedOrigins, request.headers.origin)) {
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
          response.headers["access-control-allow-methods"] = httpApiCors.allowedMethods.join(",")
        }
        if (httpApiCors.allowedHeaders) {
          response.headers["access-control-allow-headers"] = httpApiCors.allowedHeaders.join(",")
        }
      } else {
        if (corsConfig && !isOriginAllowedByHapi(corsConfig.origin, request.headers.origin)) {
          return h.continue
        }

        response.headers["access-control-allow-origin"] = request.headers.origin
        if (!corsConfig || corsConfig.credentials) {
          response.headers["access-control-allow-credentials"] = "true"
        }

        if (request.method === "options") {
          response.statusCode = 200

          response.headers["access-control-expose-headers"] =
            request.headers["access-control-expose-headers"] || "content-type, content-length, etag"
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
