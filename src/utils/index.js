import { createHash } from 'crypto'

const { isArray } = Array
const { keys } = Object

export * from './detectExecutable.js'

export { default as hasEvent } from './hasEvent.js'
export { default as createUniqueId } from './createUniqueId.js'
export { default as formatToClfTime } from './formatToClfTime.js'
export { default as jsonPath } from './jsonPath.js'
export { default as parseHeaders } from './parseHeaders.js'
export { default as parseMultiValueHeaders } from './parseMultiValueHeaders.js'
export {
  default as parseMultiValueQueryStringParameters,
} from './parseMultiValueQueryStringParameters.js'
export {
  default as parseQueryStringParameters,
} from './parseQueryStringParameters.js'
export { default as satisfiesVersionRange } from './satisfiesVersionRange.js'
export {
  default as splitHandlerPathAndName,
} from './splitHandlerPathAndName.js'

export function createDefaultApiKey() {
  return createHash('md5').digest('hex')
}

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
