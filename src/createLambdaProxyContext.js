'use strict';

const utils = require('./utils');
const jwt = require('jsonwebtoken');

/*
 Mimicks the request context object
 http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html
 */
module.exports = function createLambdaProxyContext(request, options, stageVariables) {
  const authPrincipalId = request.auth && request.auth.credentials && request.auth.credentials.user;
  const authContext = (request.auth && request.auth.credentials && request.auth.credentials.context) || {};

  let body = request.payload;

  const headers = request.unprocessedHeaders;

  if (body) {
    if (typeof body !== 'string') {
      // JSON.stringify(JSON.parse(request.payload)) is NOT the same as the rawPayload
      body = request.rawPayload;
    }
    headers['Content-Length'] = Buffer.byteLength(body);

    // Set a default Content-Type if not provided.
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
  }

  const pathParams = {};

  Object.keys(request.params).forEach(key => {
    // aws doesn't auto decode path params - hapi does
    pathParams[key] = encodeURIComponent(request.params[key]);
  });

  let token = headers.Authorization;
  
  if (token && token.split(' ')[0] === 'Bearer') {
    token = token.split(' ')[1];
  }
  let claims;
  if (token) {
    claims = jwt.decode(token) || undefined;
  }

  return {
    headers,
    path: request.path,
    pathParameters: utils.nullIfEmpty(pathParams),
    requestContext: {
      accountId: 'offlineContext_accountId',
      resourceId: 'offlineContext_resourceId',
      apiId: 'offlineContext_apiId',
      stage: options.stage,
      requestId: `offlineContext_requestId_${utils.random().toString(10).slice(2)}`,
      identity: {
        cognitoIdentityPoolId: 'offlineContext_cognitoIdentityPoolId',
        accountId: 'offlineContext_accountId',
        cognitoIdentityId: 'offlineContext_cognitoIdentityId',
        caller: 'offlineContext_caller',
        apiKey: 'offlineContext_apiKey',
        sourceIp: request.info.remoteAddress,
        cognitoAuthenticationType: 'offlineContext_cognitoAuthenticationType',
        cognitoAuthenticationProvider: 'offlineContext_cognitoAuthenticationProvider',
        userArn: 'offlineContext_userArn',
        userAgent: request.headers['user-agent'] || '',
        user: 'offlineContext_user',
      },
      authorizer: Object.assign(authContext, { // 'principalId' should have higher priority
        principalId: authPrincipalId || process.env.PRINCIPAL_ID || 'offlineContext_authorizer_principalId', // See #24
        claims,
      }),
      resourcePath: request.route.path,
      httpMethod: request.method.toUpperCase(),
    },
    resource: request.route.path,
    httpMethod: request.method.toUpperCase(),
    queryStringParameters: utils.nullIfEmpty(request.query),
    stageVariables: utils.nullIfEmpty(stageVariables),
    body,
  };
};
