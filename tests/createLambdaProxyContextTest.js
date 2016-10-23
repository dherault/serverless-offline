'use strict';

const expect = require('chai').expect;
const RequestBuilder = require('./utils/RequestBuilder');
const createLambdaProxyContext = require('../src/createLambdaProxyContext');

describe('createLambdaProxyContext', () => {

  const expectFixedAttributes = (lambdaProxyContext) => {
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
  };

  const stageVariables = {};
  const options = {
    stage: 'dev',
  };

  describe('with a GET /fn1 request', () => {
    const requestBuilder = new RequestBuilder('GET', '/fn1');
    const request = requestBuilder.toObject();

    let lambdaProxyContext;

    before(() => {
      lambdaProxyContext = createLambdaProxyContext(request, options, stageVariables);
    });

    it('queryStringParameters should be null', () => {
      expect(lambdaProxyContext.queryStringParameters).to.be.null;
    });

    it('pathParameters should be null', () => {
      expect(lambdaProxyContext.pathParameters).to.be.null;
    });

    it('httpMethod should be GET', () => {
      expect(lambdaProxyContext.httpMethod).to.eq('GET');
    });

    it('body should be null', () => {
      expect(lambdaProxyContext.body).to.be.null;
    });

    it('should match fixed attributes', () => {
      expectFixedAttributes(lambdaProxyContext);
    });
  });

});
