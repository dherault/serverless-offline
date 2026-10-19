import WebSocketRequestContext from "./WebSocketRequestContext.js"
import {
  parseHeaders,
  parseMultiValueHeaders,
  parseMultiValueQueryStringParameters,
  parseQueryStringParameters,
} from "../../../utils/index.js"

export default class WebSocketAuthorizerEvent {
  #connectionId = null

  #provider = null

  #rawHeaders = null

  #url = null

  constructor(connectionId, request, provider) {
    const { rawHeaders, url } = request

    this.#connectionId = connectionId
    this.#rawHeaders = rawHeaders
    this.#url = url
    this.#provider = provider
  }

  create() {
    const headers = parseHeaders(this.#rawHeaders)
    const multiValueHeaders = parseMultiValueHeaders(this.#rawHeaders)
    const multiValueQueryStringParameters =
      parseMultiValueQueryStringParameters(this.#url)
    const queryStringParameters = parseQueryStringParameters(this.#url)

    const requestContext = new WebSocketRequestContext(
      "CONNECT",
      "$connect",
      this.#connectionId,
    ).create()

    return {
      headers,
      methodArn: `arn:aws:execute-api:${this.#provider.region}:${requestContext.accountId}:${requestContext.apiId}/${requestContext.stage}/${requestContext.routeKey}`,
      multiValueHeaders,
      // NOTE: multiValueQueryStringParameters and queryStringParameters
      // properties are only defined if they have values
      ...(multiValueQueryStringParameters && {
        multiValueQueryStringParameters,
      }),
      ...(queryStringParameters && { queryStringParameters }),
      requestContext,
      type: "REQUEST",
    }
  }
}
