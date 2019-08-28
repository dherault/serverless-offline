'use strict'

const WebSocketRequestContext = require('./WebSocketRequestContext.js')

// TODO this should be probably moved to utils, and combined with other header
// functions and utilities
function createMultiValueHeaders(headers) {
  return Object.entries(headers).reduce((acc, [key, value]) => {
    acc[key] = [value]

    return acc
  }, {})
}

module.exports = class WebSocketDisconnectEvent {
  constructor(connectionId) {
    const headers = {
      Host: 'localhost',
      'x-api-key': '',
      'x-restapi': '',
    }

    const multiValueHeaders = createMultiValueHeaders(headers)

    const requestContext = new WebSocketRequestContext(
      '$disconnect',
      'DISCONNECT',
      connectionId,
    )

    const event = {
      headers,
      isBase64Encoded: false,
      multiValueHeaders,
      requestContext,
    }

    return event
  }
}
