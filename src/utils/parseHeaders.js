'use strict'

const unflatten = require('./unflatten.js')

const { fromEntries } = Object

// (rawHeaders: Array<string>): { [string]: string }
module.exports = function parseHeaders(rawHeaders) {
  const unflattened = unflatten(rawHeaders, 2)

  return fromEntries(unflattened)
}
