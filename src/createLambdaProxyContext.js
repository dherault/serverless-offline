'use strict';

/*
 Mimicks the request context object
 http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html
 */
module.exports = function createLambdaProxyContext(request, options, stageVariables) {
  const authPrincipalId = request.auth && request.auth.credentials && request.auth.credentials.user;

  return {
    path: request.route.path,
    headers: request.headers,
    pathParameters: Object.assign({}, request.params),
    requestContext: {
      authorizer: {
        principalId: authPrincipalId || process.env.PRINCIPAL_ID || 'offlineContext_authorizer_principalId', // See #24
      },
      accountId: 'offlineContext_accountId',
      resourceId: 'offlineContext_resourceId',
      stage: options.stage,
      requestId: `offlineContext_requestId_${Math.random().toString(10).slice(2)}`,
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
    },
    resource: 'offlineContext_resource',
    httpMethod: request.method.toUpperCase(),
    queryStringParameters: Object.assign({}, request.query),
    body: JSON.stringify(request.payload),
    stageVariables: stageVariables,
  };
};
