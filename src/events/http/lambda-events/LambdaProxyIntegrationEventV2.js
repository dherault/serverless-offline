import { Buffer } from 'node:buffer'
import { env } from 'node:process'
import { log } from '@serverless/utils/log.js'
import { decodeJwt } from 'jose'
import {
  formatToClfTime,
  lowerCaseKeys,
  nullIfEmpty,
  parseHeaders,
  parseQueryStringParametersForPayloadV2,
} from '../../../utils/index.js'

const { isArray } = Array
const { parse } = JSON
const { assign, entries } = Object

// https://www.serverless.com/framework/docs/providers/aws/events/http-api/
// https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
export default class LambdaProxyIntegrationEventV2 {
  #additionalRequestContext = null

  #routeKey = null

  #request = null

  #stage = null

  constructor(request, stage, routeKey, additionalRequestContext) {
    this.#additionalRequestContext = additionalRequestContext || {}
    this.#routeKey = routeKey
    this.#request = request
    this.#stage = stage
  }

  create() {
    const authContext =
      (this.#request.auth &&
        this.#request.auth.credentials &&
        this.#request.auth.credentials.context) ||
      {}

    let authAuthorizer

    if (env.AUTHORIZER) {
      try {
        authAuthorizer = parse(env.AUTHORIZER)
      } catch {
        log.error(
          'Could not parse process.env.AUTHORIZER, make sure it is correct JSON',
        )
      }
    }

    let body = this.#request.payload

    const { rawHeaders } = this.#request.raw.req

    // NOTE FIXME request.raw.req.rawHeaders can only be null for testing (hapi shot inject())
    const headers = lowerCaseKeys(parseHeaders(rawHeaders || [])) || {}

    if (headers['sls-offline-authorizer-override']) {
      try {
        authAuthorizer = parse(headers['sls-offline-authorizer-override'])
      } catch {
        log.error(
          'Could not parse header sls-offline-authorizer-override, make sure it is correct JSON',
        )
      }
    }

    if (body) {
      if (typeof body !== 'string') {
        // this.#request.payload is NOT the same as the rawPayload
        body = this.#request.rawPayload
      }

      if (
        !headers['content-length'] &&
        (typeof body === 'string' ||
          body instanceof Buffer ||
          body instanceof ArrayBuffer)
      ) {
        headers['content-length'] = String(Buffer.byteLength(body))
      }

      // Set a default Content-Type if not provided.
      if (!headers['content-type']) {
        headers['content-type'] = 'application/json'
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
        claims = decodeJwt(token)
        if (claims.scope) {
          scopes = claims.scope.split(' ')
          // In AWS HTTP Api the scope property is removed from the decoded JWT
          // I'm leaving this property because I'm not sure how all of the authorizers
          // for AWS REST Api handle JWT.
          // claims = { ...claims }
          // delete claims.scope
        }
      } catch {
        // Do nothing
      }
    }

    const {
      headers: _headers,
      info: { received, remoteAddress },
      method,
    } = this.#request

    const httpMethod = method.toUpperCase()
    const requestTime = formatToClfTime(received)
    const requestTimeEpoch = received

    const cookies = this.#request.state
      ? entries(this.#request.state).flatMap(([key, value]) => {
          if (isArray(value)) {
            return value.map((v) => `${key}=${v}`)
          }
          return `${key}=${value}`
        })
      : undefined

    return {
      body,
      cookies,
      headers,
      isBase64Encoded: false,
      pathParameters: nullIfEmpty(pathParams),
      queryStringParameters: this.#request.url.search
        ? parseQueryStringParametersForPayloadV2(this.#request.url.searchParams)
        : null,
      rawPath: this.#request.url.pathname,
      rawQueryString: this.#request.url.searchParams.toString(),
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
          path: this.#request.url.pathname,
          protocol: 'HTTP/1.1',
          sourceIp: remoteAddress,
          userAgent: _headers['user-agent'] || '',
        },
        operationName: this.#additionalRequestContext.operationName,
        requestId: 'offlineContext_resourceId',
        routeKey: this.#routeKey,
        stage: this.#stage,
        time: requestTime,
        timeEpoch: requestTimeEpoch,
      },
      routeKey: this.#routeKey,
      stageVariables: null,
      version: '2.0',
    }
  }
}
