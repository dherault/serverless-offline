/* global describe before context it */

'use strict';

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const RequestBuilder = require('../support/RequestBuilder');
const createLambdaProxyContext = require('../../src/createLambdaProxyContext');

const expect = chai.expect;
chai.use(dirtyChai);

describe('createLambdaProxyContext', () => {

  const expectFixedAttributes = lambdaProxyContext => {
    const requestContext = lambdaProxyContext.requestContext;
    expect(requestContext.accountId).to.eq('offlineContext_accountId');
    expect(requestContext.resourceId).to.eq('offlineContext_resourceId');
    expect(requestContext.identity.cognitoIdentityPoolId).to.eq('offlineContext_cognitoIdentityPoolId');
    expect(requestContext.identity.accountId).to.eq('offlineContext_accountId');
    expect(requestContext.identity.cognitoIdentityId).to.eq('offlineContext_cognitoIdentityId');
    expect(requestContext.identity.caller).to.eq('offlineContext_caller');
    expect(requestContext.identity.apiKey).to.eq('offlineContext_apiKey');
    expect(requestContext.identity.cognitoAuthenticationType).to.eq('offlineContext_cognitoAuthenticationType');
    expect(requestContext.identity.cognitoAuthenticationProvider).to.eq('offlineContext_cognitoAuthenticationProvider');
    expect(requestContext.identity.userArn).to.eq('offlineContext_userArn');
    expect(requestContext.identity.user).to.eq('offlineContext_user');
    expect(requestContext.authorizer.principalId).to.eq('offlineContext_authorizer_principalId');
  };

  const stageVariables = {};
  const options = {
    stage: 'dev',
  };

  context('with a GET /fn1 request', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1');
    const request = requestBuilder.toObject();

    let lambdaProxyContext;

    before(() => {
      lambdaProxyContext = createLambdaProxyContext(request, options, stageVariables);
    });

    it('queryStringParameters should be null', () => {
      expect(lambdaProxyContext.queryStringParameters).to.be.null();
    });

    it('pathParameters should be null', () => {
      expect(lambdaProxyContext.pathParameters).to.be.null();
    });

    it('httpMethod should be GET', () => {
      expect(lambdaProxyContext.httpMethod).to.eq('GET');
    });

    it('body should be null', () => {
      expect(lambdaProxyContext.body).to.be.null();
    });

    it('should match fixed attributes', () => {
      expectFixedAttributes(lambdaProxyContext);
    });
  });

  context('with a GET /fn1 request with headers', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1');
    requestBuilder.addHeader('Content-Type', 'application/json');
    requestBuilder.addHeader('Authorization', 'Token token="1234567890"');
    const request = requestBuilder.toObject();

    let lambdaProxyContext;

    before(() => {
      lambdaProxyContext = createLambdaProxyContext(request, options, stageVariables);
    });

    it('should have two headers', () => {
      expect(Object.keys(lambdaProxyContext.headers).length).to.eq(2);
      expect(lambdaProxyContext.headers['Content-Type']).to.eq('application/json');
      expect(lambdaProxyContext.headers.Authorization).to.eq('Token token="1234567890"');
    });

    it('should not have claims for authorizer if token is not JWT', () => {
      expect(lambdaProxyContext.requestContext.authorizer.claims).to.be.undefined;
    });
  });

  context('with a GET /fn1 request with Authorization header that contains JWT token', () => {
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
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
    const bearerToken = `Bearer ${token}`;

    it('should have claims for authorizer if Authorization header has valid JWT', () => {
      const requestBuilder = new RequestBuilder('GET', '/fn1');
      requestBuilder.addHeader('Authorization', token);
      const request = requestBuilder.toObject();
      const lambdaProxyContext = createLambdaProxyContext(request, options, stageVariables);
      expect(lambdaProxyContext.requestContext.authorizer.claims).to.deep.equal({
        sub: '1234567890',
        name: 'John Doe',
        admin: true,
      });
    });

    it('should have claims for authorizer if authorization header has valid JWT', () => {
      const requestBuilder = new RequestBuilder('GET', '/fn1');
      requestBuilder.addHeader('authorization', token);
      const request = requestBuilder.toObject();
      const lambdaProxyContext = createLambdaProxyContext(request, options, stageVariables);
      expect(lambdaProxyContext.requestContext.authorizer.claims).to.deep.equal({
        sub: '1234567890',
        name: 'John Doe',
        admin: true,
      });
    });

    it('should have claims for authorizer if Authorization header has valid Bearer JWT', () => {
      const requestBuilder = new RequestBuilder('GET', '/fn1');
      requestBuilder.addHeader('Authorization', bearerToken);
      const request = requestBuilder.toObject();
      const lambdaProxyContext = createLambdaProxyContext(request, options, stageVariables);
      expect(lambdaProxyContext.requestContext.authorizer.claims).to.deep.equal({
        sub: '1234567890',
        name: 'John Doe',
        admin: true,
      });
    });

    it('should have claims for authorizer if authorization header has valid Bearer JWT', () => {
      const requestBuilder = new RequestBuilder('GET', '/fn1');
      requestBuilder.addHeader('authorization', bearerToken);
      const request = requestBuilder.toObject();
      const lambdaProxyContext = createLambdaProxyContext(request, options, stageVariables);
      expect(lambdaProxyContext.requestContext.authorizer.claims).to.deep.equal({
        sub: '1234567890',
        name: 'John Doe',
        admin: true,
      });
    });
  });

  context('with a POST /fn1 request with no headers', () => {
    const requestBuilder = new RequestBuilder('POST', '/fn1');
    requestBuilder.addBody({ key: 'value' });
    const request = requestBuilder.toObject();

    let lambdaProxyContext;

    before(() => {
      lambdaProxyContext = createLambdaProxyContext(request, options, stageVariables);
    });

    it('should calculate the Content-Length header', () => {
      expect(lambdaProxyContext.headers['Content-Length']).to.eq(15);
    });

    it('should inject a default Content-Type header', () => {
      expect(lambdaProxyContext.headers['Content-Type']).to.eq('application/json');
    });

    it('should stringify the payload for the body', () => {
      expect(lambdaProxyContext.body).to.eq('{"key":"value"}');
    });
    it('should not have claims for authorizer', () => {
      expect(lambdaProxyContext.requestContext.authorizer.claims).to.be.undefined;
    });
  });

  context('with a GET /fn1/{id} request with path parameters', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1/1234');
    requestBuilder.addParam('id', '1234');
    const request = requestBuilder.toObject();

    let lambdaProxyContext;

    before(() => {
      lambdaProxyContext = createLambdaProxyContext(request, options, stageVariables);
    });

    it('should have a path parameter', () => {
      expect(Object.keys(lambdaProxyContext.pathParameters).length).to.eq(1);
      expect(lambdaProxyContext.pathParameters.id).to.eq('1234');
    });
  });

  context('with a GET /fn1/{id} request with encoded path parameters', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1/test|1234');
    requestBuilder.addParam('id', 'test|1234');
    const request = requestBuilder.toObject();

    let lambdaProxyContext;

    before(() => {
      lambdaProxyContext = createLambdaProxyContext(request, options, stageVariables);
    });

    it('should have a path parameter', () => {
      expect(Object.keys(lambdaProxyContext.pathParameters).length).to.eq(1);
      expect(lambdaProxyContext.pathParameters.id).to.eq('test%7C1234');
    });
  });
});
