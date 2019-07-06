'use strict';

const RequestBuilder = require('../support/RequestBuilder');
const createLambdaProxyEvent = require('../../createLambdaProxyEvent');

const { isArray } = Array;

describe('createLambdaProxyEvent', () => {
  const expectFixedAttributes = (lambdaProxyContext) => {
    const { requestContext } = lambdaProxyContext;

    expect(requestContext.accountId).toEqual('offlineContext_accountId');
    expect(requestContext.resourceId).toEqual('offlineContext_resourceId');
    expect(requestContext.identity.cognitoIdentityPoolId).toEqual(
      'offlineContext_cognitoIdentityPoolId',
    );
    expect(requestContext.identity.accountId).toEqual(
      'offlineContext_accountId',
    );
    expect(requestContext.identity.cognitoIdentityId).toEqual(
      'offlineContext_cognitoIdentityId',
    );
    expect(requestContext.identity.caller).toEqual('offlineContext_caller');
    expect(requestContext.identity.apiKey).toEqual('offlineContext_apiKey');
    expect(requestContext.identity.cognitoAuthenticationType).toEqual(
      'offlineContext_cognitoAuthenticationType',
    );
    expect(requestContext.identity.cognitoAuthenticationProvider).toEqual(
      'offlineContext_cognitoAuthenticationProvider',
    );
    expect(requestContext.identity.userArn).toEqual('offlineContext_userArn');
    expect(requestContext.identity.user).toEqual('offlineContext_user');
    expect(requestContext.authorizer.principalId).toEqual(
      'offlineContext_authorizer_principalId',
    );
    expect(requestContext.requestTimeEpoch).toEqual(1);
  };

  const stageVariables = {};
  const options = {
    stage: 'dev',
  };

  describe('with a GET /fn1 request', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1');
    const request = requestBuilder.toObject();

    let lambdaProxyContext;

    beforeEach(() => {
      lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );
    });

    test('queryStringParameters should be null', () => {
      expect(lambdaProxyContext.queryStringParameters).toEqual(null);
    });

    test('pathParameters should be null', () => {
      expect(lambdaProxyContext.pathParameters).toEqual(null);
    });

    test('httpMethod should be GET', () => {
      expect(lambdaProxyContext.httpMethod).toEqual('GET');
    });

    test('body should be null', () => {
      expect(lambdaProxyContext.body).toEqual(null);
    });

    test('should have a unique requestId', () => {
      const prefix = 'offlineContext_requestId_';
      expect(
        lambdaProxyContext.requestContext.requestId.length,
      ).toBeGreaterThan(prefix.length);

      const randomNumber = +lambdaProxyContext.requestContext.requestId.slice(
        prefix.length,
      );

      expect(typeof randomNumber).toEqual('number');
    });

    test('should match fixed attributes', () => {
      expectFixedAttributes(lambdaProxyContext);
    });
  });

  describe('with a GET /fn1 request with headers', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1');
    requestBuilder.addHeader('Content-Type', 'application/json');
    requestBuilder.addHeader('Authorization', 'Token token="1234567890"');
    const request = requestBuilder.toObject();

    let lambdaProxyContext;

    beforeEach(() => {
      lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );
    });

    test('should have two headers', () => {
      expect(Object.keys(lambdaProxyContext.headers).length).toEqual(2);
      expect(lambdaProxyContext.headers['Content-Type']).toEqual(
        'application/json',
      );
      expect(lambdaProxyContext.headers.Authorization).toEqual(
        'Token token="1234567890"',
      );
    });

    test('should not have claims for authorizer if token is not JWT', () => {
      expect(lambdaProxyContext.requestContext.authorizer.claims).toEqual(
        undefined,
      );
    });
  });

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
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
    const bearerToken = `Bearer ${token}`;

    test('should have claims for authorizer if Authorization header has valid JWT', () => {
      const requestBuilder = new RequestBuilder('GET', '/fn1');
      requestBuilder.addHeader('Authorization', token);
      const request = requestBuilder.toObject();
      const lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );

      expect(lambdaProxyContext.requestContext.authorizer.claims).toEqual({
        admin: true,
        name: 'John Doe',
        sub: '1234567890',
      });
    });

    test('should have claims for authorizer if authorization header has valid JWT', () => {
      const requestBuilder = new RequestBuilder('GET', '/fn1');
      requestBuilder.addHeader('authorization', token);
      const request = requestBuilder.toObject();
      const lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );

      expect(lambdaProxyContext.requestContext.authorizer.claims).toEqual({
        admin: true,
        name: 'John Doe',
        sub: '1234567890',
      });
    });

    test('should have claims for authorizer if Authorization header has valid Bearer JWT', () => {
      const requestBuilder = new RequestBuilder('GET', '/fn1');
      requestBuilder.addHeader('Authorization', bearerToken);
      const request = requestBuilder.toObject();
      const lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );

      expect(lambdaProxyContext.requestContext.authorizer.claims).toEqual({
        admin: true,
        name: 'John Doe',
        sub: '1234567890',
      });
    });

    test('should have claims for authorizer if authorization header has valid Bearer JWT', () => {
      const requestBuilder = new RequestBuilder('GET', '/fn1');
      requestBuilder.addHeader('authorization', bearerToken);
      const request = requestBuilder.toObject();
      const lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );

      expect(lambdaProxyContext.requestContext.authorizer.claims).toEqual({
        admin: true,
        name: 'John Doe',
        sub: '1234567890',
      });
    });
  });

  describe('with a POST /fn1 request with no headers', () => {
    const requestBuilder = new RequestBuilder('POST', '/fn1');
    requestBuilder.addBody({ key: 'value' });
    const request = requestBuilder.toObject();

    let lambdaProxyContext;

    beforeEach(() => {
      lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );
    });

    test('should calculate the Content-Length header', () => {
      expect(lambdaProxyContext.headers['Content-Length']).toEqual(15);
    });

    test('should inject a default Content-Type header', () => {
      expect(lambdaProxyContext.headers['Content-Type']).toEqual(
        'application/json',
      );
    });

    test('should stringify the payload for the body', () => {
      expect(lambdaProxyContext.body).toEqual('{"key":"value"}');
    });

    test('should not have claims for authorizer', () => {
      expect(lambdaProxyContext.requestContext.authorizer.claims).toEqual(
        undefined,
      );
    });
  });

  describe('with a POST /fn1 request with a lowercase Content-Type header', () => {
    test('should assign the value to Content-Type', () => {
      const requestBuilder = new RequestBuilder('POST', '/fn1');
      requestBuilder.addBody({ key: 'value' });
      requestBuilder.addHeader('content-type', 'custom/test');
      const request = requestBuilder.toObject();

      const lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );

      expect(lambdaProxyContext.headers['content-type']).toEqual('custom/test');
    });
  });

  describe('with a POST /fn1 request with a single content-type header', () => {
    test('should not assign the value to Content-Type', () => {
      const requestBuilder = new RequestBuilder('POST', '/fn1');
      requestBuilder.addBody({ key: 'value' });
      requestBuilder.addHeader('content-type', 'custom/test');
      const request = requestBuilder.toObject();

      const lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );

      expect(lambdaProxyContext.headers['Content-Type']).toEqual(undefined);
    });
  });

  describe('with a POST /fn1 request with a accept header', () => {
    test('should assign the value to accept', () => {
      const requestBuilder = new RequestBuilder('POST', '/fn1');
      requestBuilder.addBody({ key: 'value' });
      requestBuilder.addHeader('accept', 'custom/test');
      const request = requestBuilder.toObject();

      const lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );

      expect(lambdaProxyContext.headers.accept).toEqual('custom/test');
    });
  });

  describe('with a POST /fn1 request with a camelcase Content-Type header', () => {
    test('should assign the value to Content-Type', () => {
      const requestBuilder = new RequestBuilder('POST', '/fn1');
      requestBuilder.addBody({ key: 'value' });
      requestBuilder.addHeader('Content-Type', 'custom/test');
      const request = requestBuilder.toObject();

      const lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );

      expect(lambdaProxyContext.headers['Content-Type']).toEqual('custom/test');
    });
  });

  describe('with a POST /fn1 request with a set Content-length', () => {
    test('should have one content-length header only', () => {
      const requestBuilder = new RequestBuilder('POST', '/fn1');
      requestBuilder.addBody({ key: 'value' });
      requestBuilder.addHeader('content-type', 'custom/test');
      requestBuilder.addHeader('content-length', '2');
      const request = requestBuilder.toObject();

      const lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );

      expect(
        Object.keys(lambdaProxyContext.headers).filter(
          (header) => header === 'content-length',
        ),
      ).toHaveLength(1);
    });
  });

  describe('with a POST /fn1 request with a set Content-length', () => {
    test('should have one content-length header only', () => {
      const requestBuilder = new RequestBuilder('POST', '/fn1');
      requestBuilder.addBody({ key: 'value' });
      requestBuilder.addHeader('content-type', 'custom/test');
      requestBuilder.addHeader('Content-length', '2');

      const request = requestBuilder.toObject();

      const lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );
      expect(
        Object.keys(lambdaProxyContext.headers).filter(
          (header) => header.toLowerCase() === 'content-length',
        ),
      ).toHaveLength(1);
    });
  });

  describe('with a POST /fn1 request with a X-GitHub-Event header', () => {
    test('should assign not change the header case', () => {
      const requestBuilder = new RequestBuilder('POST', '/fn1');
      requestBuilder.addBody({ key: 'value' });
      requestBuilder.addHeader('X-GitHub-Event', 'test');

      const request = requestBuilder.toObject();

      const lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );

      expect(lambdaProxyContext.headers['X-GitHub-Event']).toEqual('test');
      expect(lambdaProxyContext.multiValueHeaders['X-GitHub-Event']).toEqual([
        'test',
      ]);
    });
  });

  describe('with a POST /fn1 request with multiValueHeaders', () => {
    test('should assign not change the header case', () => {
      const requestBuilder = new RequestBuilder('POST', '/fn1');
      requestBuilder.addBody({ key: 'value' });
      requestBuilder.addHeader('Some-Header', 'test1');
      requestBuilder.addHeader('Some-Header', 'test2');

      const request = requestBuilder.toObject();

      const lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );

      expect(lambdaProxyContext.headers['Some-Header']).toEqual('test2');
      expect(lambdaProxyContext.multiValueHeaders['Some-Header']).toEqual([
        'test1',
        'test2',
      ]);
    });
  });

  describe('with a GET /fn1/{id} request with path parameters', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1/1234');
    requestBuilder.addParam('id', '1234');
    const request = requestBuilder.toObject();

    let lambdaProxyContext;

    beforeEach(() => {
      lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );
    });

    test('should have a path parameter', () => {
      expect(Object.keys(lambdaProxyContext.pathParameters).length).toEqual(1);
      expect(lambdaProxyContext.pathParameters.id).toEqual('1234');
    });
  });

  describe('with a GET /fn1/{id} request with encoded path parameters', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1/test|1234');
    requestBuilder.addParam('id', 'test|1234');
    const request = requestBuilder.toObject();

    let lambdaProxyContext;

    beforeEach(() => {
      lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );
    });

    test('should have a path parameter', () => {
      expect(Object.keys(lambdaProxyContext.pathParameters).length).toEqual(1);
      expect(lambdaProxyContext.pathParameters.id).toEqual('test|1234');
    });
  });

  describe('with a GET /fn1?param=1 request with single parameter in query string', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1?param=1');
    requestBuilder.addQuery('param', '1');
    const request = requestBuilder.toObject();

    let lambdaProxyContext;

    beforeEach(() => {
      lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );
    });

    test('should have a query parameter named param', () => {
      expect(
        Object.keys(lambdaProxyContext.queryStringParameters).length,
      ).toEqual(1);
      expect(lambdaProxyContext.queryStringParameters.param).toEqual('1');
    });

    test('should have a multi value query parameter', () => {
      expect(
        isArray(lambdaProxyContext.multiValueQueryStringParameters.param),
      ).toEqual(true);
      expect(
        lambdaProxyContext.multiValueQueryStringParameters.param[0],
      ).toEqual('1');
    });
  });

  describe('with a GET /fn1?param=1&param2=1 request with double parameters in query string', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1?param=1');
    requestBuilder.addQuery('param', '1');
    requestBuilder.addQuery('param2', '1');
    const request = requestBuilder.toObject();

    let lambdaProxyContext;

    beforeEach(() => {
      lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );
    });

    test('should have a two query parameters', () => {
      expect(
        Object.keys(lambdaProxyContext.queryStringParameters).length,
      ).toEqual(2);
      expect(lambdaProxyContext.queryStringParameters.param).toEqual('1');
      expect(lambdaProxyContext.queryStringParameters.param2).toEqual('1');
    });
  });

  describe('with a GET /fn1?param=1&param=1 request with single query string', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1?param=1');
    // emaulate HAPI `query` as described here:
    // https://futurestud.io/tutorials/hapi-how-to-use-query-parameters#multiplequeryparametersofthesamename
    requestBuilder.addQuery('param', ['1', '2']);
    const request = requestBuilder.toObject();

    let lambdaProxyContext;

    beforeEach(() => {
      lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );
    });

    test('should have a two query parameters', () => {
      expect(
        Object.keys(lambdaProxyContext.queryStringParameters).length,
      ).toEqual(1);
      expect(lambdaProxyContext.queryStringParameters.param).toEqual('2');
    });
  });

  describe('with a GET /fn1?param=1&param=2 request with multiValueQueryStringParameters', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1?param=1&param=2');
    // emaulate HAPI `query` as described here:
    // https://futurestud.io/tutorials/hapi-how-to-use-query-parameters#multiplequeryparametersofthesamename
    requestBuilder.addQuery('param', ['1', '2']);
    const request = requestBuilder.toObject();

    let lambdaProxyContext;

    beforeEach(() => {
      lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );
    });

    test('multi value param should have a two values', () => {
      expect(
        Object.keys(lambdaProxyContext.multiValueQueryStringParameters).length,
      ).toEqual(1);
      expect(
        lambdaProxyContext.multiValueQueryStringParameters.param.length,
      ).toEqual(2);
    });
  });

  describe('with a request that includes cognito-identity-id header', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1');
    const testId = 'test-id';
    requestBuilder.addHeader('cognito-identity-id', testId);
    const request = requestBuilder.toObject();
    let lambdaProxyContext;

    beforeEach(() => {
      lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );
    });

    test('should have the expected cognitoIdentityId', () => {
      expect(
        lambdaProxyContext.requestContext.identity.cognitoIdentityId,
      ).toEqual(testId);
    });

    test('should have the expected headers', () => {
      expect(Object.keys(lambdaProxyContext.headers).length).toEqual(1);
      expect(lambdaProxyContext.headers['cognito-identity-id']).toEqual(testId);
    });
  });

  describe('with a request that includes cognito-authentication-provider header', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1');
    const testId = 'lorem:ipsum:test-id';
    requestBuilder.addHeader('cognito-authentication-provider', testId);
    const request = requestBuilder.toObject();
    let lambdaProxyContext;

    beforeEach(() => {
      lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );
    });

    test('should have the expected cognitoAuthenticationProvider', () => {
      expect(
        lambdaProxyContext.requestContext.identity
          .cognitoAuthenticationProvider,
      ).toEqual(testId);
    });

    test('should have the expected headers', () => {
      expect(Object.keys(lambdaProxyContext.headers).length).toEqual(1);
      expect(
        lambdaProxyContext.headers['cognito-authentication-provider'],
      ).toEqual(testId);
    });
  });

  describe('with environment variables', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1');
    const request = requestBuilder.toObject();

    let lambdaProxyContext;

    beforeEach(() => {
      process.env.SLS_ACCOUNT_ID = 'customAccountId';
      process.env.SLS_API_KEY = 'customApiKey';
      process.env.SLS_CALLER = 'customCaller';
      process.env.SLS_COGNITO_AUTHENTICATION_PROVIDER =
        'customCognitoAuthenticationProvider';
      process.env.SLS_COGNITO_AUTHENTICATION_TYPE =
        'customCognitoAuthenticationType';
      process.env.SLS_COGNITO_IDENTITY_ID = 'customCognitoIdentityId';
      process.env.SLS_COGNITO_IDENTITY_POOL_ID = 'customCognitoIdentityPoolId';

      lambdaProxyContext = createLambdaProxyEvent(
        request,
        options,
        stageVariables,
      );
    });

    test('should have the expected cognitoIdentityPoolId', () => {
      expect(
        lambdaProxyContext.requestContext.identity.cognitoIdentityPoolId,
      ).toEqual('customCognitoIdentityPoolId');
    });

    test('should have the expected accountId', () => {
      expect(lambdaProxyContext.requestContext.identity.accountId).toEqual(
        'customAccountId',
      );
    });

    test('should have the expected cognitoIdentityId', () => {
      expect(
        lambdaProxyContext.requestContext.identity.cognitoIdentityId,
      ).toEqual('customCognitoIdentityId');
    });

    test('should have the expected caller', () => {
      expect(lambdaProxyContext.requestContext.identity.caller).toEqual(
        'customCaller',
      );
    });

    test('should have the expected apiKey', () => {
      expect(lambdaProxyContext.requestContext.identity.apiKey).toEqual(
        'customApiKey',
      );
    });

    test('should have the expected cognitoAuthenticationType', () => {
      expect(
        lambdaProxyContext.requestContext.identity.cognitoAuthenticationType,
      ).toEqual('customCognitoAuthenticationType');
    });

    test('should have the expected cognitoAuthenticationProvider', () => {
      expect(
        lambdaProxyContext.requestContext.identity
          .cognitoAuthenticationProvider,
      ).toEqual('customCognitoAuthenticationProvider');
    });
  });
});
