import WebSocketRequestContext from './WebSocketRequestContext.js'
import {
  parseHeaders,
  parseMultiValueHeaders,
  parseMultiValueQueryStringParameters,
  parseQueryStringParameters,
} from '../../../utils/index.js'

export default class WebSocketConnectEvent {
  #connectionId = null

  #httpsProtocol = null

  #rawHeaders = null

  #url = null

  #websocketPort = null

  constructor(connectionId, request, options) {
    const { httpsProtocol, websocketPort } = options
    const { rawHeaders, url } = request

    this.#connectionId = connectionId
    this.#httpsProtocol = httpsProtocol
    this.#rawHeaders = rawHeaders
    this.#url = url
    this.#websocketPort = websocketPort
  }

  create() {
    // const headers = {
    //   Host: 'localhost',
    //   'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
    //   'Sec-WebSocket-Key': createUniqueId(),
    //   'Sec-WebSocket-Version': '13',
    //   'X-Amzn-Trace-Id': `Root=${createUniqueId()}`,
    //   'X-Forwarded-For': '127.0.0.1',
    //   'X-Forwarded-Port': String(this.#websocketPort),
    //   'X-Forwarded-Proto': ${httpsProtocol ? 'https' : 'http'},
    // }

    const headers = parseHeaders(this.#rawHeaders)
    const multiValueHeaders = parseMultiValueHeaders(this.#rawHeaders)
    const multiValueQueryStringParameters =
      parseMultiValueQueryStringParameters(this.#url)
    const queryStringParameters = parseQueryStringParameters(this.#url)

    const requestContext = new WebSocketRequestContext(
      'CONNECT',
      '$connect',
      this.#connectionId,
    ).create()

    return {
      headers,
      isBase64Encoded: false,
      multiValueHeaders,
      // NOTE: multiValueQueryStringParameters and queryStringParameters
      // properties are only defined if they have values
      ...(multiValueQueryStringParameters && {
        multiValueQueryStringParameters,
      }),
      ...(queryStringParameters && { queryStringParameters }),
      requestContext,
    }
  }
}
