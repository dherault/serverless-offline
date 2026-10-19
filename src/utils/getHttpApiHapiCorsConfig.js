import getHttpApiCorsConfig from "./getHttpApiCorsConfig.js"

// converts the provider.httpApi.cors setting into the cors options of a
// hapi route
export default function getHttpApiHapiCorsConfig(httpApiCorsSetting) {
  const httpApiCors = getHttpApiCorsConfig(httpApiCorsSetting)

  return {
    credentials: httpApiCors.allowCredentials,
    exposedHeaders: httpApiCors.exposedResponseHeaders || [],
    headers: httpApiCors.allowedHeaders || [],
    maxAge: httpApiCors.maxAge,
    origin: httpApiCors.allowedOrigins || [],
  }
}
