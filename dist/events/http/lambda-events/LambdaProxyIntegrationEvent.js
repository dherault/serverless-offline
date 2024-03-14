import { Buffer } from 'node:buffer'
import { env } from 'node:process'
import { log } from '@serverless/utils/log.js'
import { decode } from 'jsonwebtoken'
import {
  createUniqueId,
  formatToClfTime,
  nullIfEmpty,
  parseHeaders,
  parseMultiValueHeaders,
  parseMultiValueQueryStringParameters,
  parseQueryStringParameters,
} from '../../../utils/index.js'
const { byteLength } = Buffer
const { parse } = JSON
const { assign } = Object
export default class LambdaProxyIntegrationEvent {
  #additionalRequestContext = null
  #path = null
  #routeKey = null
  #request = null
  #stage = null
  #stageVariables = null
  constructor(
    request,
    stage,
    path,
    stageVariables,
    routeKey,
    additionalRequestContext,
  ) {
    this.#additionalRequestContext = additionalRequestContext || {}
    this.#path = path
    this.#routeKey = routeKey
    this.#request = request
    this.#stage = stage
    this.#stageVariables = stageVariables
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
    if (env.AUTHORIZER) {
      try {
        authAuthorizer = parse(env.AUTHORIZER)
      } catch {
        log.error(
          'Could not parse env.AUTHORIZER, make sure it is correct JSON',
        )
      }
    }
    let body = this.#request.payload
    const { rawHeaders, url } = this.#request.raw.req
    const headers = parseHeaders(rawHeaders || []) || {}
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
    const pathParams = {
      ...this.#request.params,
    }
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
        }
      } catch {}
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
    const resource = this.#routeKey || route.path.replace(`/${this.#stage}`, '')
    return {
      body,
      headers,
      httpMethod,
      isBase64Encoded: false,
      multiValueHeaders: parseMultiValueHeaders(rawHeaders || []),
      multiValueQueryStringParameters:
        parseMultiValueQueryStringParameters(url),
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
            principalId:
              authPrincipalId ||
              env.PRINCIPAL_ID ||
              'offlineContext_authorizer_principalId',
            scopes,
          }),
        domainName: 'offlineContext_domainName',
        domainPrefix: 'offlineContext_domainPrefix',
        extendedRequestId: createUniqueId(),
        httpMethod,
        identity: {
          accessKey: null,
          accountId: env.SLS_ACCOUNT_ID || 'offlineContext_accountId',
          apiKey: env.SLS_API_KEY || 'offlineContext_apiKey',
          apiKeyId: env.SLS_API_KEY_ID || 'offlineContext_apiKeyId',
          caller: env.SLS_CALLER || 'offlineContext_caller',
          cognitoAuthenticationProvider:
            _headers['cognito-authentication-provider'] ||
            env.SLS_COGNITO_AUTHENTICATION_PROVIDER ||
            'offlineContext_cognitoAuthenticationProvider',
          cognitoAuthenticationType:
            env.SLS_COGNITO_AUTHENTICATION_TYPE ||
            'offlineContext_cognitoAuthenticationType',
          cognitoIdentityId:
            _headers['cognito-identity-id'] ||
            env.SLS_COGNITO_IDENTITY_ID ||
            'offlineContext_cognitoIdentityId',
          cognitoIdentityPoolId:
            env.SLS_COGNITO_IDENTITY_POOL_ID ||
            'offlineContext_cognitoIdentityPoolId',
          principalOrgId: null,
          sourceIp: remoteAddress,
          user: 'offlineContext_user',
          userAgent: _headers['user-agent'] || '',
          userArn: 'offlineContext_userArn',
        },
        operationName: this.#additionalRequestContext.operationName,
        path: this.#path,
        protocol: 'HTTP/1.1',
        requestId: createUniqueId(),
        requestTime,
        requestTimeEpoch,
        resourceId: 'offlineContext_resourceId',
        resourcePath: route.path,
        stage: this.#stage,
      },
      resource,
      stageVariables: this.#stageVariables,
    }
  }
}
