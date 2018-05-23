'use strict';

const utils = require('./utils');
const jsonPath = require('./jsonPath');
const jsEscapeString = require('js-string-escape');
const isPlainObject = require('lodash').isPlainObject;

function escapeJavaScript(x) {
  if (typeof x === 'string') return jsEscapeString(x).replace(/\\n/g, '\n'); // See #26,
  else if (isPlainObject(x)) {
    const result = {};
    for (let key in x) { // eslint-disable-line prefer-const
      result[key] = jsEscapeString(x[key]);
    }

    return JSON.stringify(result); // Is this really how APIG does it?
  }
  else if (typeof x.toString === 'function') return escapeJavaScript(x.toString());

  return x;
}

/*
  Returns a context object that mocks APIG mapping template reference
  http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
*/
module.exports = function createVelocityContext(request, options, payload) {

  const path = x => jsonPath(payload || {}, x);
  const authPrincipalId = request.auth && request.auth.credentials && request.auth.credentials.user;
  const headers = request.unprocessedHeaders;

  return {
    context: {
      apiId:      'offlineContext_apiId',
      authorizer: {
        principalId: authPrincipalId || process.env.PRINCIPAL_ID || 'offlineContext_authorizer_principalId', // See #24
      },
      httpMethod: request.method.toUpperCase(),
      identity:   {
        accountId:                     'offlineContext_accountId',
        apiKey:                        'offlineContext_apiKey',
        caller:                        'offlineContext_caller',
        cognitoAuthenticationProvider: 'offlineContext_cognitoAuthenticationProvider',
        cognitoAuthenticationType:     'offlineContext_cognitoAuthenticationType',
        sourceIp:                      request.info.remoteAddress,
        user:                          'offlineContext_user',
        userAgent:                     request.headers['user-agent'] || '',
        userArn:                       'offlineContext_userArn',
      },
      requestId:    `offlineContext_requestId_${utils.randomId()}`,
      resourceId:   'offlineContext_resourceId',
      resourcePath: request.route.path,
      stage:        options.stage,
    },
    input: {
      body: payload, // Not a string yet, todo
      json:   x => JSON.stringify(path(x)),
      params: x => typeof x === 'string' ?
        request.params[x] || request.query[x] || headers[x] :
        ({
          path: Object.assign({}, request.params),
          querystring: Object.assign({}, request.query),
          header: headers,
        }),
      path,
    },
    stageVariables: options.stageVariables,
    util: {
      escapeJavaScript,
      urlEncode: encodeURI,
      urlDecode: decodeURI,
      base64Encode: x => new Buffer(x.toString(), 'binary').toString('base64'),
      base64Decode: x => new Buffer(x.toString(), 'base64').toString('binary'),
      parseJson: JSON.parse,
    },
  };
};
