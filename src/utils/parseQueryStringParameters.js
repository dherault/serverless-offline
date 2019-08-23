'use strict'

const { URL } = require('url')

const { fromEntries } = Object

// dummy placeholder url for the WHATWG URL constructor
// https://github.com/nodejs/node/issues/12682
// TODO move to common constants file
const BASE_URL_PLACEHOLDER = 'http://example'

module.exports = function parseQueryStringParameters(url) {
  const { searchParams } = new URL(url, BASE_URL_PLACEHOLDER)

  if (Array.from(searchParams).length === 0) {
    return null
  }

  return fromEntries(searchParams)
}
