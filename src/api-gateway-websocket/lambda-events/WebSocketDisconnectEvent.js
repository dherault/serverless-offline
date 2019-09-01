import WebSocketRequestContext from './WebSocketRequestContext.js'

// TODO this should be probably moved to utils, and combined with other header
// functions and utilities
function createMultiValueHeaders(headers) {
  return Object.entries(headers).reduce((acc, [key, value]) => {
    acc[key] = [value]

    return acc
  }, {})
}

export default class WebSocketDisconnectEvent {
  constructor(connectionId) {
    this._connectionId = connectionId
  }

  create() {
    const headers = {
      Host: 'localhost',
      'x-api-key': '',
      'x-restapi': '',
    }

    const multiValueHeaders = createMultiValueHeaders(headers)

    const requestContext = new WebSocketRequestContext(
      'DISCONNECT',
      '$disconnect',
      this._connectionId,
    ).create()

    return {
      headers,
      isBase64Encoded: false,
      multiValueHeaders,
      requestContext,
    }
  }
}
