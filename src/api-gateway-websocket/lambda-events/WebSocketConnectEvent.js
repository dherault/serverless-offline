import WebSocketRequestContext from './WebSocketRequestContext.js'
import {
  createUniqueId,
  parseMultiValueQueryStringParameters,
  parseQueryStringParameters,
} from '../../utils/index.js'

// TODO this should be probably moved to utils, and combined with other header
// functions and utilities
function createMultiValueHeaders(headers) {
  return Object.entries(headers).reduce((acc, [key, value]) => {
    acc[key] = [value]

    return acc
  }, {})
}

export default class WebSocketConnectEvent {
  constructor(connectionId, request, options) {
    const { httpsProtocol, websocketPort } = options
    const { url } = request

    this._connectionId = connectionId
    this._httpsProtocol = httpsProtocol
    this._url = url
    this._websocketPort = websocketPort
  }

  create() {
    const headers = {
      Host: 'localhost',
      'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
      'Sec-WebSocket-Key': createUniqueId(),
      'Sec-WebSocket-Version': '13',
      'X-Amzn-Trace-Id': `Root=${createUniqueId()}`,
      'X-Forwarded-For': '127.0.0.1',
      'X-Forwarded-Port': String(this._websocketPort),
      'X-Forwarded-Proto': `http${this._httpsProtocol ? 's' : ''}`,
    }

    const multiValueHeaders = createMultiValueHeaders(headers)

    const multiValueQueryStringParameters = parseMultiValueQueryStringParameters(
      this._url,
    )

    const queryStringParameters = parseQueryStringParameters(this._url)

    const requestContext = new WebSocketRequestContext(
      'CONNECT',
      '$connect',
      this._connectionId,
    ).create()

    return {
      headers,
      isBase64Encoded: false,
      multiValueHeaders,
      multiValueQueryStringParameters,
      queryStringParameters,
      requestContext,
    }
  }
}
