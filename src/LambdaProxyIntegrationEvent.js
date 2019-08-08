'use strict'

const { decode } = require('jsonwebtoken')
const {
  createUniqueId,
  normalizeMultiValueQuery,
  normalizeQuery,
  nullIfEmpty,
} = require('./utils/index.js')

const { byteLength } = Buffer
const { parse } = JSON

// https://serverless.com/framework/docs/providers/aws/events/apigateway/
// https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
// http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html
module.exports = class LambdaProxyIntegrationEvent {
  constructor(request, options, stageVariables) {
    this._options = options
    this._request = request
    this._stageVariables = stageVariables
  }

  getEvent() {
    const authPrincipalId =
      this._request.auth &&
      this._request.auth.credentials &&
      this._request.auth.credentials.user
    const authContext =
      (this._request.auth &&
        this._request.auth.credentials &&
        this._request.auth.credentials.context) ||
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

    let body = this._request.payload

    const headers = this._request.unprocessedHeaders

    if (body) {
      if (typeof body !== 'string') {
        // this._request.payload is NOT the same as the rawPayload
        body = this._request.rawPayload
      }

      if (
        !headers['Content-Length'] &&
        !headers['content-length'] &&
        !headers['Content-length'] &&
        (typeof body === 'string' ||
          body instanceof Buffer ||
          body instanceof ArrayBuffer)
      ) {
        headers['Content-Length'] = byteLength(body)
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
    const pathParams = { ...this._request.params }

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

    return {
      body,
      headers,
      httpMethod: this._request.method.toUpperCase(),
      multiValueHeaders: this._request.multiValueHeaders,
      multiValueQueryStringParameters: nullIfEmpty(
        normalizeMultiValueQuery(this._request.query),
      ),
      path: this._request.path,
      pathParameters: nullIfEmpty(pathParams),
      queryStringParameters: nullIfEmpty(normalizeQuery(this._request.query)),
      requestContext: {
        accountId: 'offlineContext_accountId',
        apiId: 'offlineContext_apiId',
        authorizer:
          authAuthorizer ||
          Object.assign(authContext, {
            claims,
            // 'principalId' should have higher priority
            principalId:
              authPrincipalId ||
              process.env.PRINCIPAL_ID ||
              'offlineContext_authorizer_principalId', // See #24
          }),
        httpMethod: this._request.method.toUpperCase(),
        identity: {
          accountId: process.env.SLS_ACCOUNT_ID || 'offlineContext_accountId',
          apiKey: process.env.SLS_API_KEY || 'offlineContext_apiKey',
          caller: process.env.SLS_CALLER || 'offlineContext_caller',
          cognitoAuthenticationProvider:
            this._request.headers['cognito-authentication-provider'] ||
            process.env.SLS_COGNITO_AUTHENTICATION_PROVIDER ||
            'offlineContext_cognitoAuthenticationProvider',
          cognitoAuthenticationType:
            process.env.SLS_COGNITO_AUTHENTICATION_TYPE ||
            'offlineContext_cognitoAuthenticationType',
          cognitoIdentityId:
            this._request.headers['cognito-identity-id'] ||
            process.env.SLS_COGNITO_IDENTITY_ID ||
            'offlineContext_cognitoIdentityId',
          cognitoIdentityPoolId:
            process.env.SLS_COGNITO_IDENTITY_POOL_ID ||
            'offlineContext_cognitoIdentityPoolId',
          sourceIp: this._request.info.remoteAddress,
          user: 'offlineContext_user',
          userAgent: this._request.headers['user-agent'] || '',
          userArn: 'offlineContext_userArn',
        },
        protocol: 'HTTP/1.1',
        requestId: `offlineContext_requestId_${createUniqueId()}`,
        requestTimeEpoch: this._request.info.received,
        resourceId: 'offlineContext_resourceId',
        resourcePath: this._request.route.path,
        stage: this._options.stage,
      },
      resource: this._request.route.path,
      stageVariables: nullIfEmpty(this._stageVariables),
    }
  }
}
