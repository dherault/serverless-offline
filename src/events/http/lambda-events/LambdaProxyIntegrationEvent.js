import { Buffer } from 'buffer'
import { decode } from 'jsonwebtoken'
import {
  createUniqueId,
  formatToClfTime,
  nullIfEmpty,
  parseHeaders,
  parseMultiValueHeaders,
  parseQueryStringParameters,
  parseMultiValueQueryStringParameters,
} from '../../../utils/index.js'

const { byteLength } = Buffer
const { parse } = JSON
const { assign } = Object

// https://serverless.com/framework/docs/providers/aws/events/apigateway/
// https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
// http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html
export default class LambdaProxyIntegrationEvent {
  #path = null
  #request = null
  #stage = null

  constructor(request, stage, path) {
    this.#path = path
    this.#request = request
    this.#stage = stage
  }

  create() {
    const authPrincipalId =
      this.#request.auth &&
      this.#request.auth.credentials &&
      this.#request.auth.credentials.principalId

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

    if (token) {
      try {
        claims = decode(token) || undefined
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

    return {
      body,
      headers,
      httpMethod,
      isBase64Encoded: false, // TODO hook up
      multiValueHeaders: parseMultiValueHeaders(
        // NOTE FIXME request.raw.req.rawHeaders can only be null for testing (hapi shot inject())
        rawHeaders || [],
      ),
      multiValueQueryStringParameters: parseMultiValueQueryStringParameters(
        url,
      ),
      path: this.#path,
      pathParameters: nullIfEmpty(pathParams),
      queryStringParameters: parseQueryStringParameters(url),
      requestContext: {
        accountId: 'offlineContext_accountId',
        apiId: 'offlineContext_apiId',
        authorizer:
          authAuthorizer ||
          assign(authContext, {
            claims,
            // 'principalId' should have higher priority
            principalId:
              authPrincipalId ||
              process.env.PRINCIPAL_ID ||
              'offlineContext_authorizer_principalId', // See #24
          }),
        domainName: 'offlineContext_domainName',
        domainPrefix: 'offlineContext_domainPrefix',
        extendedRequestId: createUniqueId(),
        httpMethod,
        identity: {
          accessKey: null,
          accountId: process.env.SLS_ACCOUNT_ID || 'offlineContext_accountId',
          apiKey: process.env.SLS_API_KEY || 'offlineContext_apiKey',
          caller: process.env.SLS_CALLER || 'offlineContext_caller',
          cognitoAuthenticationProvider:
            _headers['cognito-authentication-provider'] ||
            process.env.SLS_COGNITO_AUTHENTICATION_PROVIDER ||
            'offlineContext_cognitoAuthenticationProvider',
          cognitoAuthenticationType:
            process.env.SLS_COGNITO_AUTHENTICATION_TYPE ||
            'offlineContext_cognitoAuthenticationType',
          cognitoIdentityId:
            _headers['cognito-identity-id'] ||
            process.env.SLS_COGNITO_IDENTITY_ID ||
            'offlineContext_cognitoIdentityId',
          cognitoIdentityPoolId:
            process.env.SLS_COGNITO_IDENTITY_POOL_ID ||
            'offlineContext_cognitoIdentityPoolId',
          principalOrgId: null,
          sourceIp: remoteAddress,
          user: 'offlineContext_user',
          userAgent: _headers['user-agent'] || '',
          userArn: 'offlineContext_userArn',
        },
        path: route.path,
        protocol: 'HTTP/1.1',
        requestId: createUniqueId(),
        requestTime,
        requestTimeEpoch,
        resourceId: 'offlineContext_resourceId',
        resourcePath: this.#path,
        stage: this.#stage,
      },
      resource: this.#path,
      stageVariables: null,
    }
  }
}
