'use strict';

const jsEscapeString = require('js-string-escape');
const { decode } = require('jsonwebtoken');
const { isPlainObject, createUniqueId } = require('./utils');
const jsonPath = require('./jsonPath');

function escapeJavaScript(x) {
  if (typeof x === 'string') return jsEscapeString(x).replace(/\\n/g, '\n'); // See #26,
  if (isPlainObject(x)) {
    const result = {};
    for (const key in x) {
      result[key] = jsEscapeString(x[key]);
    }

    return JSON.stringify(result); // Is this really how APIG does it?
  }
  if (typeof x.toString === 'function') return escapeJavaScript(x.toString());

  return x;
}

/*
  Returns a context object that mocks APIG mapping template reference
  http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
*/
module.exports = function createVelocityContext(request, options, payload) {
  const path = (x) => jsonPath(payload || {}, x);
  const authPrincipalId = request.auth && request.auth.credentials && request.auth.credentials.principalId;

  let authorizer;

  if (process.env.AUTHORIZER) {
    try {
      authorizer = JSON.parse(process.env.AUTHORIZER);
    } catch (error) {
      console.error(
        'Serverless-offline: Could not parse process.env.AUTHORIZER, make sure it is correct JSON.',
      );
    }
  } else {
    authorizer = request.auth
        && request.auth.credentials
        && request.auth.credentials.authorizer;
  }

  const headers = request.unprocessedHeaders;

  let token = headers && (headers.Authorization || headers.authorization);

  if (token && token.split(' ')[0] === 'Bearer') {
    [, token] = token.split(' ');
  }

  if (!authorizer) authorizer = {};
  authorizer.principalId = authorizer.principalId
    || authPrincipalId
    || process.env.PRINCIPAL_ID
    || 'offlineContext_authorizer_principalId'; // See #24


  if (token) {
    try {
      const claims = decode(token) || undefined;
      if (claims) {
        Object.assign(authorizer, { claims });
      }
    } catch (err) {
      // Nothing
    }
  }

  return {
    context: {
      apiId: 'offlineContext_apiId',
      authorizer,
      httpMethod: request.method.toUpperCase(),
      identity: {
        accountId: 'offlineContext_accountId',
        apiKey: 'offlineContext_apiKey',
        caller: 'offlineContext_caller',
        cognitoAuthenticationProvider:
          'offlineContext_cognitoAuthenticationProvider',
        cognitoAuthenticationType: 'offlineContext_cognitoAuthenticationType',
        sourceIp: request.info.remoteAddress,
        user: 'offlineContext_user',
        userAgent: request.headers['user-agent'] || '',
        userArn: 'offlineContext_userArn',
      },
      requestId: `offlineContext_requestId_${createUniqueId()}`,
      resourceId: 'offlineContext_resourceId',
      resourcePath: request.route.path,
      stage: options.stage,
    },
    input: {
      body: payload, // Not a string yet, todo
      json: (x) => JSON.stringify(path(x)),
      path,
      params: (x) =>
        typeof x === 'string'
          ? request.params[x] || request.query[x] || headers[x]
          : {
            header: headers,
            path: Object.assign({}, request.params),
            querystring: Object.assign({}, request.query),
          },
    },
    stageVariables: options.stageVariables,
    util: {
      base64Decode: (x) =>
        Buffer.from(x.toString(), 'base64').toString('binary'),
      base64Encode: (x) =>
        Buffer.from(x.toString(), 'binary').toString('base64'),
      escapeJavaScript,
      parseJson: JSON.parse,
      urlDecode: (x) => decodeURIComponent(x.replace(/\+/g, ' ')),
      urlEncode: encodeURI,
    },
  };
};
