export { default as checkDockerDaemon } from "./checkDockerDaemon.js"
export { default as checkGoVersion } from "./checkGoVersion.js"
export { default as createApiKey } from "./createApiKey.js"
export { default as detectExecutable } from "./detectExecutable.js"
export { default as formatToClfTime } from "./formatToClfTime.js"
export { default as generateHapiPath } from "./generateHapiPath.js"
export { default as getApiKeysValues } from "./getApiKeysValues.js"
export { default as getHttpApiCorsConfig } from "./getHttpApiCorsConfig.js"
export { default as getRawQueryParams } from "./getRawQueryParams.js"
export { default as jsonPath } from "./jsonPath.js"
export { default as lowerCaseKeys } from "./lowerCaseKeys.js"
export { default as parseHeaders } from "./parseHeaders.js"
export { default as parseMultiValueHeaders } from "./parseMultiValueHeaders.js"
export { default as parseMultiValueQueryStringParameters } from "./parseMultiValueQueryStringParameters.js"
export { default as parseQueryStringParameters } from "./parseQueryStringParameters.js"
export { default as parseQueryStringParametersForPayloadV2 } from "./parseQueryStringParametersForPayloadV2.js"
export { default as splitHandlerPathAndName } from "./splitHandlerPathAndName.js"
export { generateAlbHapiPath } from "./generateHapiPath.js"
// export { default as baseImage } from './baseImage.js'

const { isArray } = Array
const { keys } = Object

const possibleBinaryContentTypes = [
  "application/octet-stream",
  "multipart/form-data",
]

// Detect the toString encoding from the request headers content-type
// enhance if further content types need to be non utf8 encoded.
export function detectEncoding(request) {
  const contentType = request.headers["content-type"]

  return typeof contentType === "string" &&
    possibleBinaryContentTypes.some((possibleBinaryContentType) =>
      contentType.includes(possibleBinaryContentType),
    )
    ? "binary"
    : "utf8"
}

export function nullIfEmpty(obj) {
  return obj && (keys(obj).length > 0 ? obj : null)
}

export function isPlainObject(obj) {
  return typeof obj === "object" && !isArray(obj) && obj != null
}

export function toPlainOrEmptyObject(obj) {
  return typeof obj === "object" && !isArray(obj) ? obj : {}
}
