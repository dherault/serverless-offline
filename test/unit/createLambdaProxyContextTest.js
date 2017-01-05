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
  });
});
