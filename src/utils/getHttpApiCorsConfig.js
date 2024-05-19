import { log } from "./log.js"

export default function getHttpApiCorsConfig(httpApiCors) {
  if (httpApiCors === true) {
    // default values that should be set by serverless
    // https://www.serverless.com/framework/docs/providers/aws/events/http-api/
    const c = {
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

    log.debug("Using CORS policy", c)

    return c
  }

  log.debug("Using CORS policy", httpApiCors)

  return httpApiCors
}
