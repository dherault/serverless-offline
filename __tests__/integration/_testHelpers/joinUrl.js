'use strict'

const { URL } = require('url')

module.exports = function joinUrl(baseUrl, path) {
  const url = new URL(baseUrl)
  const { pathname } = url

  url.pathname = pathname === '/' ? path : `${pathname}${path}`

  return url
}
