'use strict';

const utils = require('./utils');

/*
 Mimicks the request context object
 http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html
 */
module.exports = function createLambdaProxyContext(request, options, stageVariables) {
  const authPrincipalId = request.auth && request.auth.credentials && request.auth.credentials.user;

  var body = request.payload && JSON.stringify(request.payload);
  var headers = utils.capitalizeKeys(request.headers);

  if (body) {
    headers['Content-Length'] = Buffer.byteLength(body);
    headers['Content-Type'] = 'application/json';
  }

  return {
    path: request.path,
    headers: headers,
    pathParameters: utils.nullIfEmpty(request.params),
    requestContext: {
      accountId: 'offlineContext_accountId',
      resourceId: 'offlineContext_resourceId',
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
      authorizer: {
        principalId: authPrincipalId || process.env.PRINCIPAL_ID || 'offlineContext_authorizer_principalId', // See #24
      },
    },
    resource: request.route.path,
    httpMethod: request.method.toUpperCase(),
    queryStringParameters: utils.nullIfEmpty(request.query),
    body: body,
    stageVariables: utils.nullIfEmpty(stageVariables),
  };
};
