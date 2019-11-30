const { isArray } = Array
const { keys } = Object

export * from './detectExecutable.js'

export { default as createApiKey } from './createApiKey'
export { default as createUniqueId } from './createUniqueId'
export { default as formatToClfTime } from './formatToClfTime'
export { default as jsonPath } from './jsonPath'
export { default as parseHeaders } from './parseHeaders'
export { default as parseMultiValueHeaders } from './parseMultiValueHeaders'
export { default as parseMultiValueQueryStringParameters } from './parseMultiValueQueryStringParameters'
export { default as parseQueryStringParameters } from './parseQueryStringParameters'
export { default as satisfiesVersionRange } from './satisfiesVersionRange'
export { default as splitHandlerPathAndName } from './splitHandlerPathAndName'

// Detect the toString encoding from the request headers content-type
// enhance if further content types need to be non utf8 encoded.
export function detectEncoding(request) {
  const contentType = request.headers['content-type']

  return typeof contentType === 'string' &&
    contentType.includes('multipart/form-data')
    ? 'binary'
    : 'utf8'
}

export function nullIfEmpty(obj) {
  return obj && (keys(obj).length > 0 ? obj : null)
}

export function isPlainObject(obj) {
  return typeof obj === 'object' && !isArray(obj) && obj != null
}

export function toPlainOrEmptyObject(obj) {
  return typeof obj === 'object' && !isArray(obj) ? obj : {}
}
