import { Buffer } from 'buffer'
import { decode } from 'jsonwebtoken'
import {
  formatToClfTime,
  nullIfEmpty,
  parseHeaders,
  parseQueryStringParameters,
} from '../../../utils/index.js'
import { BASE_URL_PLACEHOLDER } from '../../../config/index.js'

const { byteLength } = Buffer
const { parse } = JSON
const { assign } = Object

// https://www.serverless.com/framework/docs/providers/aws/events/http-api/
// https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
export default class LambdaProxyIntegrationEventV2 {
  #path = null
  #request = null
  #stage = null
  #stageVariables = null

  constructor(request, stage, path, stageVariables) {
    this.#path = path
    this.#request = request
    this.#stage = stage
    this.#stageVariables = stageVariables
  }

  create() {
    const authContext =
      (this.#request.auth &&
        this.#request.auth.credentials &&
        this.#request.auth.credentials.context) ||
      {}

    let authAuthorizer

    if (process.env.AUTHORIZER) {
      try {
        authAuthorizer = parse(process.env.AUTHORIZER)
      } catch (error) {
        console.error(
          'Serverless-offline: Could not parse process.env.AUTHORIZER, make sure it is correct JSON.',
        )
      }
    }

    let body = this.#request.payload

    const { rawHeaders, url } = this.#request.raw.req

    // NOTE FIXME request.raw.req.rawHeaders can only be null for testing (hapi shot inject())
    const headers = parseHeaders(rawHeaders || []) || {}

    if (body) {
      if (typeof body !== 'string') {
        // this.#request.payload is NOT the same as the rawPayload
        body = this.#request.rawPayload
      }

      if (
        !headers['Content-Length'] &&
        !headers['content-length'] &&
        !headers['Content-length'] &&
        (typeof body === 'string' ||
          body instanceof Buffer ||
          body instanceof ArrayBuffer)
      ) {
        headers['Content-Length'] = String(byteLength(body))
      }

      // Set a default Content-Type if not provided.
      if (
        !headers['Content-Type'] &&
        !headers['content-type'] &&
        !headers['Content-type']
      ) {
        headers['Content-Type'] = 'application/json'
      }
    } else if (typeof body === 'undefined' || body === '') {
      body = null
    }

    // clone own props
    const pathParams = { ...this.#request.params }

    let token = headers.Authorization || headers.authorization

    if (token && token.split(' ')[0] === 'Bearer') {
      ;[, token] = token.split(' ')
    }

    let claims
    let scopes

    if (token) {
      try {
        claims = decode(token) || undefined
        if (claims && claims.scope) {
          scopes = claims.scope.split(' ')
          // In AWS HTTP Api the scope property is removed from the decoded JWT
          // I'm leaving this property because I'm not sure how all of the authorizers
          // for AWS REST Api handle JWT.
          // claims = { ...claims }
          // delete claims.scope
        }
      } catch (err) {
        // Do nothing
      }
    }

    const {
      headers: _headers,
      info: { received, remoteAddress },
      method,
      route,
    } = this.#request

    const httpMethod = method.toUpperCase()
    const requestTime = formatToClfTime(received)
    const requestTimeEpoch = received

    const cookies = Object.entries(this.#request.state).map(
      ([key, value]) => `${key}=${value}`,
    )

    return {
      version: '2.0',
      routeKey: this.#path,
      rawPath: route.path,
      rawQueryString: new URL(
        url,
        BASE_URL_PLACEHOLDER,
      ).searchParams.toString(),
      cookies,
      headers,
      queryStringParameters: parseQueryStringParameters(url),
      requestContext: {
        accountId: 'offlineContext_accountId',
        apiId: 'offlineContext_apiId',
        authorizer:
          authAuthorizer ||
          assign(authContext, {
            jwt: {
              claims,
              scopes,
            },
          }),
        domainName: 'offlineContext_domainName',
        domainPrefix: 'offlineContext_domainPrefix',
        http: {
          method: httpMethod,
          path: this.#path,
          protocol: 'HTTP/1.1',
          sourceIp: remoteAddress,
          userAgent: _headers['user-agent'] || '',
        },
        requestId: 'offlineContext_resourceId',
        routeKey: this.#path,
        stage: this.#stage,
        time: requestTime,
        timeEpoch: requestTimeEpoch,
      },
      body,
      pathParameters: nullIfEmpty(pathParams),
      isBase64Encoded: false,
      stageVariables: this.#stageVariables,
    }
  }
}
