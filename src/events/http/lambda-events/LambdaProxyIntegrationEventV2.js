import {
  formatToClfTime,
  nullIfEmpty,
  parseAuthorization,
  parseBody,
  parseEnvironmentVariable,
  parseHeaders,
} from '../../../utils/index.js'

const { assign } = Object

// https://www.serverless.com/framework/docs/providers/aws/events/http-api/
// https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
export default class LambdaProxyIntegrationEventV2 {
  #routeKey = null
  #request = null
  #stage = null
  #stageVariables = null

  constructor(request, stage, routeKey, stageVariables) {
    this.#routeKey = routeKey
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

    const authAuthorizer = parseEnvironmentVariable('AUTHORIZER')
    const { rawHeaders } = this.#request.raw.req

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
    } = this.#request

    const httpMethod = method.toUpperCase()
    const requestTime = formatToClfTime(received)
    const requestTimeEpoch = received

    const cookies = Object.entries(this.#request.state).map(
      ([key, value]) => `${key}=${value}`,
    )

    return {
      version: '2.0',
      routeKey: this.#routeKey,
      rawPath: this.#request.url.pathname,
      rawQueryString: this.#request.url.searchParams.toString(),
      cookies,
      headers,
      queryStringParameters: this.#request.url.search
        ? Object.fromEntries(Array.from(this.#request.url.searchParams))
        : null,
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
        requestId: 'offlineContext_resourceId',
        routeKey: this.#routeKey,
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
