'use strict';

const expect = require('chai').expect;
const RequestBuilder = require('./utils/RequestBuilder');
const createLambdaProxyContext = require('../src/createLambdaProxyContext');


describe('createLambdaProxyContext', () => {

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
  });

});
