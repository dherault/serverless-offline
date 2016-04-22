'use strict';

const jsonPath = require('./jsonPath');
const jsEscapeString = require('js-string-escape');
const isPlainObject = require('lodash.isplainobject');

/*
  Returns a context object that mocks APIG mapping template reference
  http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
*/
module.exports = function createVelocityContext(request, options, payload) {
  
  const path = x => jsonPath(payload || {}, x);

  // Capitalize request.headers as NodeJS use lowercase headers 
  // however API Gateway always pass capitalize headers
  const headers = {};
  for (let key in request.headers) {
    headers[key.replace(/((?:^|-)[a-z])/g, x => x.toUpperCase())] = request.headers[key];
  }
  
  return {
    context: {
      apiId: 'offlineContext_apiId',
      authorizer: {
        principalId: process.env.PRINCIPAL_ID || 'offlineContext_authorizer_principalId', // See #24
      },
      httpMethod: request.method.toUpperCase(),
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
        request.params[x] || request.query[x] || headers[x] :
        {
          path: request.params,
          querystring: request.query,
          header: headers,
        },
      path,
    },
    stageVariables: options.stageVariables,
    util: {
      urlEncode: encodeURI,
      urlDecode: decodeURI,
      escapeJavaScript,
      base64Encode: x => new Buffer(x.toString(), 'binary').toString('base64'),
      base64Decode: x => new Buffer(x.toString(), 'base64').toString('binary'),
    },
  };
};

function escapeJavaScript(x) {
  if (typeof x === 'string') return jsEscapeString(x).replace(/\\n/g, '\n'); // See #26,
  else if (isPlainObject(x)) {
    const result = {};
    for (let key in x) {
      result[key] = jsEscapeString(x[key]);
    }
    return JSON.stringify(result); // Is this really how APIG does it?
  }
  else if (typeof x.toString === 'function') return escapeJavaScript(x.toString());
  else return x;
}
