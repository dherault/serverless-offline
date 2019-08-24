'use strict'

const { createHash } = require('crypto')

const { isArray } = Array
const { keys } = Object

const {
  detectRuby,
  detectPython2,
  detectPython3,
} = require('./detectExecutable.js')

exports.detectRuby = detectRuby
exports.detectPython2 = detectPython2
exports.detectPython3 = detectPython3

const { hasHttpEvent, hasWebsocketEvent } = require('./hasEvent.js')

exports.hasHttpEvent = hasHttpEvent
exports.hasWebsocketEvent = hasWebsocketEvent

exports.createUniqueId = require('./createUniqueId.js')
exports.formatToClfTime = require('./formatToClfTime.js')
exports.parseHeaders = require('./parseHeaders.js')
exports.parseMultiValueHeaders = require('./parseMultiValueHeaders.js')
exports.parseMultiValueQueryStringParameters = require('./parseMultiValueQueryStringParameters.js')
exports.parseQueryStringParameters = require('./parseQueryStringParameters.js')
exports.satisfiesVersionRange = require('./satisfiesVersionRange.js')
exports.splitHandlerPathAndName = require('./splitHandlerPathAndName.js')

exports.createDefaultApiKey = function createDefaultApiKey() {
  return createHash('md5').digest('hex')
}

// Detect the toString encoding from the request headers content-type
// enhance if further content types need to be non utf8 encoded.
exports.detectEncoding = function detectEncoding(request) {
  const contentType = request.headers['content-type']

  return typeof contentType === 'string' &&
    contentType.includes('multipart/form-data')
    ? 'binary'
    : 'utf8'
}

exports.nullIfEmpty = function nullIfEmpty(obj) {
  return obj && (keys(obj).length > 0 ? obj : null)
}

exports.isPlainObject = function isPlainObject(obj) {
  return typeof obj === 'object' && !isArray(obj) && obj != null
}

exports.toPlainOrEmptyObject = function toPlainOrEmptyObject(obj) {
  return typeof obj === 'object' && !isArray(obj) ? obj : {}
}
