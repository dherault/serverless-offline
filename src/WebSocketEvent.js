'use strict'

const WebSocketRequestContext = require('./WebSocketRequestContext.js')

module.exports = class WebSocketEvent {
  constructor(action, eventType, connectionId, payload) {
    const requestContext = new WebSocketRequestContext(
      action,
      eventType,
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
