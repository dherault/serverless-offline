'use strict'

const { createHash } = require('crypto')
const objectFromEntries = require('object.fromentries')

objectFromEntries.shim()

const { isArray } = Array
const { entries, fromEntries, keys } = Object

const { detectRuby, detectPython } = require('./detectExecutable.js')

exports.detectRuby = detectRuby
exports.detectPython = detectPython

exports.createUniqueId = require('./createUniqueId.js')
exports.formatToClfTime = require('./formatToClfTime.js')
exports.parseMultiValueQueryStringParameters = require('./parseMultiValueQueryStringParameters.js')
exports.parseQueryStringParameters = require('./parseQueryStringParameters.js')
exports.satisfiesVersionRange = require('./satisfiesVersionRange.js')
exports.splitHandlerPathAndName = require('./splitHandlerPathAndName.js')

exports.toPlainOrEmptyObject = function toPlainOrEmptyObject(obj) {
  return typeof obj === 'object' && !isArray(obj) ? obj : {}
}

exports.nullIfEmpty = function nullIfEmpty(o) {
  return o && (keys(o).length > 0 ? o : null)
}

exports.isPlainObject = function isPlainObject(obj) {
  return typeof obj === 'object' && !isArray(obj) && obj != null
}

exports.normalizeQuery = function normalizeQuery(query) {
  // foreach key, ensure that the value is an array
  return fromEntries(
    entries(query).map(([key, value]) => [key, [].concat(value).pop()]),
  )
}

exports.normalizeMultiValueQuery = function normalizeMultiValueQuery(query) {
  // foreach key, ensure that the value is an array
  return fromEntries(
    entries(query).map(([key, value]) => [key, [].concat(value)]),
  )
}

exports.capitalizeKeys = function capitalizeKeys(o) {
  return fromEntries(
    entries(o).map(([key, value]) => [
      key.replace(/((?:^|-)[a-z])/g, (x) => x.toUpperCase()),
      value,
    ]),
  )
}

// Detect the toString encoding from the request headers content-type
// enhance if further content types need to be non utf8 encoded.
exports.detectEncoding = function detectEncoding(request) {
  return typeof request.headers['content-type'] === 'string' &&
    request.headers['content-type'].includes('multipart/form-data')
    ? 'binary'
    : 'utf8'
}

exports.createDefaultApiKey = function createDefaultApiKey() {
  return createHash('md5').digest('hex')
}
