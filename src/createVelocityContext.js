'use strict';

const jsonPath = require('./jsonPath');
const escapeJavaScript = require('js-string-escape');

/*
  Returns a context object that mocks APIG mapping template reference
  http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
*/
module.exports = function createVelocityContext(request, options, payload) {
  
  const path = x => jsonPath(payload || {}, x);
  
  return {
    context: {
      apiId: 'offlineContext_apiId',
      authorizer: {
        principalId: 'offlineContext_authorizer_principalId',
      },
      httpMethod:request.method.toUpperCase(),
      identity: {
        accountId: 'offlineContext_accountId',
        apiKey: 'offlineContext_apiKey',
        caller: 'offlineContext_caller',
        cognitoAuthenticationProvider: 'offlineContext_cognitoAuthenticationProvider',
        cognitoAuthenticationType: 'offlineContext_cognitoAuthenticationType',
        sourceIp: request.info.remoteAddress,
        user: 'offlineContext_user',
        userAgent: request.headers['user-agent'],
        userArn: 'offlineContext_userArn',
      },
      requestId: 'offlineContext_requestId_' + Math.random().toString(10).slice(2),
      resourceId: 'offlineContext_resourceId',
      resourcePath: request.route.path,
      stage: options.stage,
    },
    input: {
      json: x => JSON.stringify(path(x)),
      params: x => typeof x === 'string' ?
        request.params[x] || request.query[x] || request.headers[x] :
        {
          path: request.params,
          querystring: request.query,
          header: request.headers,
        },
      path,
    },
    stageVariables: options.stageVariables,
    util: {
      escapeJavaScript,
      urlEncode: encodeURI,
      urlDecode: decodeURI,
      base64Encode: x => new Buffer(x.toString(), 'binary').toString('base64'),
      base64Decode: x => new Buffer(x.toString(), 'base64').toString('binary'),
    },
  };
};
