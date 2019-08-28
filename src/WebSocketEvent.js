'use strict'

const WebSocketRequestContext = require('./WebSocketRequestContext.js')

module.exports = class WebSocketEvent {
  constructor(connectionId, route, payload) {
    const requestContext = new WebSocketRequestContext(
      route,
      'MESSAGE',
      connectionId,
    )

    const event = {
      body: payload,
      isBase64Encoded: false,
      requestContext,
    }

    return event
  }
}
