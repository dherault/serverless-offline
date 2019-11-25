import RequestBuilder from './support/RequestBuilder'
import LambdaProxyIntegrationEvent from '../../src/events/http/lambda-events/LambdaProxyIntegrationEvent'

const { isArray } = Array
const { keys } = Object

describe('LambdaProxyIntegrationEvent', () => {
  const expectFixedAttributes = (lambdaProxyIntegrationEvent) => {
    const { requestContext } = lambdaProxyIntegrationEvent

    expect(requestContext.accountId).toEqual('offlineContext_accountId')
    expect(requestContext.resourceId).toEqual('offlineContext_resourceId')
    expect(requestContext.identity.cognitoIdentityPoolId).toEqual(
      'offlineContext_cognitoIdentityPoolId',
    )
    expect(requestContext.identity.accountId).toEqual(
      'offlineContext_accountId',
    )
    expect(requestContext.identity.cognitoIdentityId).toEqual(
      'offlineContext_cognitoIdentityId',
    )
    expect(requestContext.identity.caller).toEqual('offlineContext_caller')
    expect(requestContext.identity.apiKey).toEqual('offlineContext_apiKey')
    expect(requestContext.identity.cognitoAuthenticationType).toEqual(
      'offlineContext_cognitoAuthenticationType',
    )
    expect(requestContext.identity.cognitoAuthenticationProvider).toEqual(
      'offlineContext_cognitoAuthenticationProvider',
    )
    expect(requestContext.identity.userArn).toEqual('offlineContext_userArn')
    expect(requestContext.identity.user).toEqual('offlineContext_user')
    expect(requestContext.authorizer.principalId).toEqual(
      'offlineContext_authorizer_principalId',
    )
    expect(requestContext.requestTimeEpoch).toEqual(1)
  }

  const stage = 'dev'

  describe('with a GET /fn1 request', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1')
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    test('queryStringParameters should be null', () => {
      expect(lambdaProxyIntegrationEvent.queryStringParameters).toEqual(null)
    })

    test('pathParameters should be null', () => {
      expect(lambdaProxyIntegrationEvent.pathParameters).toEqual(null)
    })

    test('httpMethod should be GET', () => {
      expect(lambdaProxyIntegrationEvent.httpMethod).toEqual('GET')
    })

    test('body should be null', () => {
      expect(lambdaProxyIntegrationEvent.body).toEqual(null)
    })

    test('should have a unique requestId', () => {
      expect(
        lambdaProxyIntegrationEvent.requestContext.requestId.length,
      ).toBeGreaterThan(0)
    })

    test('should match fixed attributes', () => {
      expectFixedAttributes(lambdaProxyIntegrationEvent)
    })
  })

  describe('with a GET /fn1 request with headers', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1')
    requestBuilder.addHeader('Content-Type', 'application/json')
    requestBuilder.addHeader('Authorization', 'Token token="1234567890"')
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    test('should have two headers', () => {
      expect(keys(lambdaProxyIntegrationEvent.headers).length).toEqual(2)
      expect(lambdaProxyIntegrationEvent.headers['Content-Type']).toEqual(
        'application/json',
      )
      expect(lambdaProxyIntegrationEvent.headers.Authorization).toEqual(
        'Token token="1234567890"',
      )
    })

    test('should not have claims for authorizer if token is not JWT', () => {
      expect(
        lambdaProxyIntegrationEvent.requestContext.authorizer.claims,
      ).toEqual(undefined)
    })
  })

  describe('with a GET /fn1 request with Authorization header that contains JWT token', () => {
    // mock token
    // header
    // {
    //    "alg": "HS256",
    //    "typ": "JWT"
    // }
    // payload
    // {
    //   "sub": "1234567890",
    //   "name": "John Doe",
    //   "admin": true
    // }

    /* eslint-disable max-len */
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ'
    const bearerToken = `Bearer ${token}`

    test('should have claims for authorizer if Authorization header has valid JWT', () => {
      const requestBuilder = new RequestBuilder('GET', '/fn1')
      requestBuilder.addHeader('Authorization', token)
      const request = requestBuilder.toObject()
      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      expect(
        lambdaProxyIntegrationEvent.requestContext.authorizer.claims,
      ).toEqual({
        admin: true,
        name: 'John Doe',
        sub: '1234567890',
      })
    })

    test('should have claims for authorizer if authorization header has valid JWT', () => {
      const requestBuilder = new RequestBuilder('GET', '/fn1')
      requestBuilder.addHeader('authorization', token)
      const request = requestBuilder.toObject()
      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      expect(
        lambdaProxyIntegrationEvent.requestContext.authorizer.claims,
      ).toEqual({
        admin: true,
        name: 'John Doe',
        sub: '1234567890',
      })
    })

    test('should have claims for authorizer if Authorization header has valid Bearer JWT', () => {
      const requestBuilder = new RequestBuilder('GET', '/fn1')
      requestBuilder.addHeader('Authorization', bearerToken)
      const request = requestBuilder.toObject()
      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      expect(
        lambdaProxyIntegrationEvent.requestContext.authorizer.claims,
      ).toEqual({
        admin: true,
        name: 'John Doe',
        sub: '1234567890',
      })
    })

    test('should have claims for authorizer if authorization header has valid Bearer JWT', () => {
      const requestBuilder = new RequestBuilder('GET', '/fn1')
      requestBuilder.addHeader('authorization', bearerToken)
      const request = requestBuilder.toObject()
      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      expect(
        lambdaProxyIntegrationEvent.requestContext.authorizer.claims,
      ).toEqual({
        admin: true,
        name: 'John Doe',
        sub: '1234567890',
      })
    })
  })

  describe('with a POST /fn1 request with no headers', () => {
    const requestBuilder = new RequestBuilder('POST', '/fn1')
    requestBuilder.addBody({ key: 'value' })
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    test('should calculate the Content-Length header', () => {
      expect(lambdaProxyIntegrationEvent.headers['Content-Length']).toEqual(
        '15',
      )
    })

    test('should inject a default Content-Type header', () => {
      expect(lambdaProxyIntegrationEvent.headers['Content-Type']).toEqual(
        'application/json',
      )
    })

    test('should stringify the payload for the body', () => {
      expect(lambdaProxyIntegrationEvent.body).toEqual('{"key":"value"}')
    })

    test('should not have claims for authorizer', () => {
      expect(
        lambdaProxyIntegrationEvent.requestContext.authorizer.claims,
      ).toEqual(undefined)
    })
  })

  describe('with a POST /fn1 request with a lowercase Content-Type header', () => {
    test('should assign the value to Content-Type', () => {
      const requestBuilder = new RequestBuilder('POST', '/fn1')
      requestBuilder.addBody({ key: 'value' })
      requestBuilder.addHeader('content-type', 'custom/test')
      const request = requestBuilder.toObject()

      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      expect(lambdaProxyIntegrationEvent.headers['content-type']).toEqual(
        'custom/test',
      )
    })
  })

  describe('with a POST /fn1 request with a single content-type header', () => {
    test('should not assign the value to Content-Type', () => {
      const requestBuilder = new RequestBuilder('POST', '/fn1')
      requestBuilder.addBody({ key: 'value' })
      requestBuilder.addHeader('content-type', 'custom/test')
      const request = requestBuilder.toObject()

      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      expect(lambdaProxyIntegrationEvent.headers['Content-Type']).toEqual(
        undefined,
      )
    })
  })

  describe('with a POST /fn1 request with a accept header', () => {
    test('should assign the value to accept', () => {
      const requestBuilder = new RequestBuilder('POST', '/fn1')
      requestBuilder.addBody({ key: 'value' })
      requestBuilder.addHeader('accept', 'custom/test')
      const request = requestBuilder.toObject()

      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      expect(lambdaProxyIntegrationEvent.headers.accept).toEqual('custom/test')
    })
  })

  describe('with a POST /fn1 request with a camelcase Content-Type header', () => {
    test('should assign the value to Content-Type', () => {
      const requestBuilder = new RequestBuilder('POST', '/fn1')
      requestBuilder.addBody({ key: 'value' })
      requestBuilder.addHeader('Content-Type', 'custom/test')
      const request = requestBuilder.toObject()

      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      expect(lambdaProxyIntegrationEvent.headers['Content-Type']).toEqual(
        'custom/test',
      )
    })
  })

  describe('with a POST /fn1 request with a set Content-length', () => {
    test('should have one content-length header only', () => {
      const requestBuilder = new RequestBuilder('POST', '/fn1')
      requestBuilder.addBody({ key: 'value' })
      requestBuilder.addHeader('content-type', 'custom/test')
      requestBuilder.addHeader('content-length', '2')
      const request = requestBuilder.toObject()

      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      expect(
        keys(lambdaProxyIntegrationEvent.headers).filter(
          (header) => header === 'content-length',
        ),
      ).toHaveLength(1)
    })
  })

  describe('with a POST /fn1 request with a set Content-length', () => {
    test('should have one content-length header only', () => {
      const requestBuilder = new RequestBuilder('POST', '/fn1')
      requestBuilder.addBody({ key: 'value' })
      requestBuilder.addHeader('content-type', 'custom/test')
      requestBuilder.addHeader('Content-length', '2')

      const request = requestBuilder.toObject()

      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
      expect(
        keys(lambdaProxyIntegrationEvent.headers).filter(
          (header) => header.toLowerCase() === 'content-length',
        ),
      ).toHaveLength(1)
    })
  })

  describe('with a POST /fn1 request with a X-GitHub-Event header', () => {
    test('should assign not change the header case', () => {
      const requestBuilder = new RequestBuilder('POST', '/fn1')
      requestBuilder.addBody({ key: 'value' })
      requestBuilder.addHeader('X-GitHub-Event', 'test')

      const request = requestBuilder.toObject()

      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      expect(lambdaProxyIntegrationEvent.headers['X-GitHub-Event']).toEqual(
        'test',
      )
      expect(
        lambdaProxyIntegrationEvent.multiValueHeaders['X-GitHub-Event'],
      ).toEqual(['test'])
    })
  })

  describe('with a POST /fn1 request with multiValueHeaders', () => {
    test('should assign not change the header case', () => {
      const requestBuilder = new RequestBuilder('POST', '/fn1')
      requestBuilder.addBody({ key: 'value' })
      requestBuilder.addHeader('Some-Header', 'test1')
      requestBuilder.addHeader('Some-Header', 'test2')

      const request = requestBuilder.toObject()

      const lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()

      expect(lambdaProxyIntegrationEvent.headers['Some-Header']).toEqual(
        'test2',
      )
      expect(
        lambdaProxyIntegrationEvent.multiValueHeaders['Some-Header'],
      ).toEqual(['test1', 'test2'])
    })
  })

  describe('with a GET /fn1/{id} request with path parameters', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1/1234')
    requestBuilder.addParam('id', '1234')
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    test('should have a path parameter', () => {
      expect(keys(lambdaProxyIntegrationEvent.pathParameters).length).toEqual(1)
      expect(lambdaProxyIntegrationEvent.pathParameters.id).toEqual('1234')
    })
  })

  describe('with a GET /fn1/{id} request with encoded path parameters', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1/test|1234')
    requestBuilder.addParam('id', 'test|1234')
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    test('should have a path parameter', () => {
      expect(keys(lambdaProxyIntegrationEvent.pathParameters).length).toEqual(1)
      expect(lambdaProxyIntegrationEvent.pathParameters.id).toEqual('test|1234')
    })
  })

  describe('with a GET /fn1?param=1 request with single parameter in query string', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1?param=1')
    requestBuilder.addQuery('?param=1')
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    test('should have a query parameter named param', () => {
      expect(
        keys(lambdaProxyIntegrationEvent.queryStringParameters).length,
      ).toEqual(1)
      expect(lambdaProxyIntegrationEvent.queryStringParameters.param).toEqual(
        '1',
      )
    })

    test('should have a multi value query parameter', () => {
      expect(
        isArray(
          lambdaProxyIntegrationEvent.multiValueQueryStringParameters.param,
        ),
      ).toEqual(true)
      expect(
        lambdaProxyIntegrationEvent.multiValueQueryStringParameters.param[0],
      ).toEqual('1')
    })
  })

  describe('with a GET /fn1?param=1&param2=1 request with double parameters in query string', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1?param=1')
    requestBuilder.addQuery('?param1=1&param2=2')
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    test('should have a two query parameters', () => {
      expect(
        keys(lambdaProxyIntegrationEvent.queryStringParameters).length,
      ).toEqual(2)
      expect(lambdaProxyIntegrationEvent.queryStringParameters.param1).toEqual(
        '1',
      )
      expect(lambdaProxyIntegrationEvent.queryStringParameters.param2).toEqual(
        '2',
      )
    })
  })

  describe('with a GET /fn1?param=1&param=1 request with single query string', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1?param=1')
    // emaulate HAPI `query` as described here:
    // https://futurestud.io/tutorials/hapi-how-to-use-query-parameters#multiplequeryparametersofthesamename
    requestBuilder.addQuery('?param=1&param=2')
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    test('should have a two query parameters', () => {
      expect(
        keys(lambdaProxyIntegrationEvent.queryStringParameters).length,
      ).toEqual(1)
      expect(lambdaProxyIntegrationEvent.queryStringParameters.param).toEqual(
        '2',
      )
    })
  })

  describe('with a GET /fn1?param=1&param=2 request with multiValueQueryStringParameters', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1?param=1&param=2')
    // emaulate HAPI `query` as described here:
    // https://futurestud.io/tutorials/hapi-how-to-use-query-parameters#multiplequeryparametersofthesamename
    requestBuilder.addQuery('?param=1&param=2')
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    test('multi value param should have a two values', () => {
      expect(
        keys(lambdaProxyIntegrationEvent.multiValueQueryStringParameters)
          .length,
      ).toEqual(1)
      expect(
        lambdaProxyIntegrationEvent.multiValueQueryStringParameters.param
          .length,
      ).toEqual(2)
    })
  })

  describe('with a request that includes cognito-identity-id header', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1')
    const testId = 'test-id'
    requestBuilder.addHeader('cognito-identity-id', testId)
    const request = requestBuilder.toObject()
    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    test('should have the expected cognitoIdentityId', () => {
      expect(
        lambdaProxyIntegrationEvent.requestContext.identity.cognitoIdentityId,
      ).toEqual(testId)
    })

    test('should have the expected headers', () => {
      expect(keys(lambdaProxyIntegrationEvent.headers).length).toEqual(1)
      expect(
        lambdaProxyIntegrationEvent.headers['cognito-identity-id'],
      ).toEqual(testId)
    })
  })

  describe('with a request that includes cognito-authentication-provider header', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1')
    const testId = 'lorem:ipsum:test-id'
    requestBuilder.addHeader('cognito-authentication-provider', testId)
    const request = requestBuilder.toObject()
    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    test('should have the expected cognitoAuthenticationProvider', () => {
      expect(
        lambdaProxyIntegrationEvent.requestContext.identity
          .cognitoAuthenticationProvider,
      ).toEqual(testId)
    })

    test('should have the expected headers', () => {
      expect(keys(lambdaProxyIntegrationEvent.headers).length).toEqual(1)
      expect(
        lambdaProxyIntegrationEvent.headers['cognito-authentication-provider'],
      ).toEqual(testId)
    })
  })

  describe('with environment variables', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1')
    const request = requestBuilder.toObject()

    let lambdaProxyIntegrationEvent

    beforeEach(() => {
      process.env.SLS_ACCOUNT_ID = 'customAccountId'
      process.env.SLS_API_KEY = 'customApiKey'
      process.env.SLS_CALLER = 'customCaller'
      process.env.SLS_COGNITO_AUTHENTICATION_PROVIDER =
        'customCognitoAuthenticationProvider'
      process.env.SLS_COGNITO_AUTHENTICATION_TYPE =
        'customCognitoAuthenticationType'
      process.env.SLS_COGNITO_IDENTITY_ID = 'customCognitoIdentityId'
      process.env.SLS_COGNITO_IDENTITY_POOL_ID = 'customCognitoIdentityPoolId'

      lambdaProxyIntegrationEvent = new LambdaProxyIntegrationEvent(
        request,
        stage,
      ).create()
    })

    test('should have the expected cognitoIdentityPoolId', () => {
      expect(
        lambdaProxyIntegrationEvent.requestContext.identity
          .cognitoIdentityPoolId,
      ).toEqual('customCognitoIdentityPoolId')
    })

    test('should have the expected accountId', () => {
      expect(
        lambdaProxyIntegrationEvent.requestContext.identity.accountId,
      ).toEqual('customAccountId')
    })

    test('should have the expected cognitoIdentityId', () => {
      expect(
        lambdaProxyIntegrationEvent.requestContext.identity.cognitoIdentityId,
      ).toEqual('customCognitoIdentityId')
    })

    test('should have the expected caller', () => {
      expect(
        lambdaProxyIntegrationEvent.requestContext.identity.caller,
      ).toEqual('customCaller')
    })

    test('should have the expected apiKey', () => {
      expect(
        lambdaProxyIntegrationEvent.requestContext.identity.apiKey,
      ).toEqual('customApiKey')
    })

    test('should have the expected cognitoAuthenticationType', () => {
      expect(
        lambdaProxyIntegrationEvent.requestContext.identity
          .cognitoAuthenticationType,
      ).toEqual('customCognitoAuthenticationType')
    })

    test('should have the expected cognitoAuthenticationProvider', () => {
      expect(
        lambdaProxyIntegrationEvent.requestContext.identity
          .cognitoAuthenticationProvider,
      ).toEqual('customCognitoAuthenticationProvider')
    })
  })
})
