'use strict'

const { URL } = require('url')
const { BASE_URL_PLACEHOLDER } = require('../config/index.js')

const { fromEntries } = Object

module.exports = function parseQueryStringParameters(url) {
  // dummy placeholder url for the WHATWG URL constructor
  // https://github.com/nodejs/node/issues/12682
  const { searchParams } = new URL(url, BASE_URL_PLACEHOLDER)

  if (Array.from(searchParams).length === 0) {
    return null
  }

  return fromEntries(searchParams)
}
