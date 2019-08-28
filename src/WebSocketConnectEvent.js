'use strict'

const WebSocketRequestContext = require('./WebSocketRequestContext.js')
const { createUniqueId } = require('./utils/index.js')

// TODO this should be probably moved to utils, and combined with other header
// functions and utilities
function createMultiValueHeaders(headers) {
  return Object.entries(headers).reduce((acc, [key, value]) => {
    acc[key] = [value]

    return acc
  }, {})
}

module.exports = class WebSocketConnectEvent {
  constructor(connectionId, options) {
    const { httpsProtocol, websocketPort } = options

    const headers = {
      Host: 'localhost',
      'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
      'Sec-WebSocket-Key': createUniqueId(),
      'Sec-WebSocket-Version': '13',
      'X-Amzn-Trace-Id': `Root=${createUniqueId()}`,
      'X-Forwarded-For': '127.0.0.1',
      'X-Forwarded-Port': String(websocketPort),
      'X-Forwarded-Proto': `http${httpsProtocol ? 's' : ''}`,
    }

    const multiValueHeaders = createMultiValueHeaders(headers)

    const requestContext = new WebSocketRequestContext(
      '$connect',
      'CONNECT',
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
