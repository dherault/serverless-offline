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
      ...(multiValueQueryStringParameters && {
        multiValueQueryStringParameters,
      }),
      ...(queryStringParameters && {
        queryStringParameters,
      }),
      requestContext,
    }
  }
}
