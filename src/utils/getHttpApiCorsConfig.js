import { log } from "./log.js"

const { isArray } = Array

// default values that should be set by serverless
// https://www.serverless.com/framework/docs/providers/aws/events/http-api/
function getDefaultCorsConfig() {
  return {
    allowedHeaders: [
      "Authorization",
      "Content-Type",
      "X-Amz-Date",
      "X-Amz-Security-Token",
      "X-Amz-User-Agent",
      "X-Api-Key",
    ],
    allowedMethods: ["DELETE", "GET", "OPTIONS", "PATCH", "POST", "PUT"],
    allowedOrigins: ["*"],
  }
}

function toArray(value) {
  return isArray(value) ? value : [value]
}

export default function getHttpApiCorsConfig(httpApiCors) {
  if (httpApiCors === true) {
    const c = getDefaultCorsConfig()

    log.debug("Using CORS policy", c)

    return c
  }

  if (httpApiCors != null && typeof httpApiCors === "object") {
    // like serverless, fall back to the default values for the settings
    // which are not configured, and accept a single value instead of a list
    const defaultCorsConfig = getDefaultCorsConfig()

    const c = {
      ...httpApiCors,
      allowedHeaders: httpApiCors.allowedHeaders
        ? toArray(httpApiCors.allowedHeaders)
        : defaultCorsConfig.allowedHeaders,
      allowedMethods: httpApiCors.allowedMethods
        ? toArray(httpApiCors.allowedMethods)
        : defaultCorsConfig.allowedMethods,
      allowedOrigins: httpApiCors.allowedOrigins
        ? toArray(httpApiCors.allowedOrigins)
        : defaultCorsConfig.allowedOrigins,
      ...(httpApiCors.exposedResponseHeaders && {
        exposedResponseHeaders: toArray(httpApiCors.exposedResponseHeaders),
      }),
    }

    log.debug("Using CORS policy", c)

    return c
  }

  log.debug("Using CORS policy", httpApiCors)

  return httpApiCors
}
