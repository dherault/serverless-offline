'use strict'

const { JSONPath } = require('jsonpath-plus')
const debugLog = require('./debugLog.js')

// wrapper around external dependency for debugging purposes
module.exports = function jsonPath(json, path) {
  debugLog('Calling jsonPath:', path)

  const [result] = JSONPath({
    json,
    path,
    wrap: true,
  })

  debugLog('jsonPath resolved:', result)

  return result
}
