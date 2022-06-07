import WebSocketRequestContext from './WebSocketRequestContext.js'
import {
  parseHeaders,
  parseMultiValueHeaders,
  parseMultiValueQueryStringParameters,
  parseQueryStringParameters,
} from '../../../utils/index.js'

export default class WebSocketAuthorizerEvent {
  #connectionId = null

  #httpsProtocol = null

  #provider = null

  #rawHeaders = null

  #url = null

  #websocketPort = null

  constructor(connectionId, request, provider, options) {
    const { httpsProtocol, websocketPort } = options
    const { rawHeaders, url } = request

    this.#connectionId = connectionId
    this.#httpsProtocol = httpsProtocol
    this.#rawHeaders = rawHeaders
    this.#url = url
    this.#websocketPort = websocketPort
    this.#provider = provider
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
      methodArn: `arn:aws:execute-api:${this.#provider.region}:${
        requestContext.accountId
      }:${requestContext.apiId}/${requestContext.stage}/${
        requestContext.routeKey
      }`,
      multiValueHeaders,
      // NOTE: multiValueQueryStringParameters and queryStringParameters
      // properties are only defined if they have values
      ...(multiValueQueryStringParameters && {
        multiValueQueryStringParameters,
      }),
      ...(queryStringParameters && { queryStringParameters }),
      requestContext,
      type: 'REQUEST',
    }
  }
}
