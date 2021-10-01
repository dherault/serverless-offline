import {
  createUniqueId,
  formatToClfTime,
  nullIfEmpty,
  parseHeaders,
  parseMultiValueHeaders,
  parseQueryStringParameters,
  parseMultiValueQueryStringParameters,
  parseBody,
  parseAuthorization,
  parseEnvironmentVariable,
} from '../../../utils/index.js'

const { assign } = Object

// https://serverless.com/framework/docs/providers/aws/events/apigateway/
// https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
// http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html
export default class LambdaProxyIntegrationEvent {
  #path = null
  #routeKey = null
  #request = null
  #stage = null
  #stageVariables = null

  constructor(request, stage, path, stageVariables, routeKey = null) {
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

    const authAuthorizer = parseEnvironmentVariable('AUTHORIZER')
    const { rawHeaders, url } = this.#request.raw.req

    // NOTE FIXME request.raw.req.rawHeaders can only be null for testing (hapi shot inject())
    const headers = parseHeaders(rawHeaders || []) || {}
    const body = parseBody(this.#request, headers)

    // clone own props
    const pathParams = { ...this.#request.params }

    const { claims, scopes } = parseAuthorization(headers)

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
            scopes,
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
          apiKeyId: process.env.SLS_API_KEY_ID || 'offlineContext_apiKeyId',
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
