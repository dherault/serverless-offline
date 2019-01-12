const utils = require('./utils');
const jwt = require('jsonwebtoken');

/*
 Mimicks the request context object
 http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html
 */
module.exports = function createLambdaProxyContext(request, options, stageVariables) {
  const authPrincipalId = request.auth && request.auth.credentials && request.auth.credentials.user;
  const authContext = (request.auth && request.auth.credentials && request.auth.credentials.context) || {};
  let authAuthorizer;

  if (process.env.AUTHORIZER) {
    try {
      authAuthorizer = JSON.parse(process.env.AUTHORIZER);
    }
    catch (error) {
      console.error('Serverless-offline: Could not parse process.env.AUTHORIZER, make sure it is correct JSON.');
    }
  }

  let body = request.payload;

  const headers = request.unprocessedHeaders;

  if (body) {
    if (typeof body !== 'string') {
      // JSON.stringify(JSON.parse(request.payload)) is NOT the same as the rawPayload
      body = request.rawPayload;
    }

    if (!headers['Content-Length'] && !headers['content-length'] && !headers['Content-length']) {
      headers['Content-Length'] = Buffer.byteLength(body);
    }

    // Set a default Content-Type if not provided.
    if (!headers['Content-Type'] && !headers['content-type'] && !headers['Content-type']) {
      headers['Content-Type'] = 'application/json';
    }
  }
  else if (typeof body === 'undefined' || body === '') {
    body = null;
  }

  const pathParams = {};

  Object.keys(request.params).forEach(key => {
    // aws doesn't auto decode path params - hapi does
    pathParams[key] = encodeURIComponent(request.params[key]);
  });

  let token = headers.Authorization || headers.authorization;

  if (token && token.split(' ')[0] === 'Bearer') {
    token = token.split(' ')[1];
  }

  let claims;

  if (token) {
    try {
      claims = jwt.decode(token) || undefined;
    }
    catch (err) {
      // Do nothing
    }
  }

  return {
    headers,
    multiValueHeaders: request.multiValueHeaders,
    path: request.path,
    pathParameters: utils.nullIfEmpty(pathParams),
    requestContext: {
      accountId: 'offlineContext_accountId',
      resourceId: 'offlineContext_resourceId',
      apiId: 'offlineContext_apiId',
      stage: options.stage,
      requestId: `offlineContext_requestId_${utils.randomId()}`,
      identity: {
        cognitoIdentityPoolId: 'offlineContext_cognitoIdentityPoolId',
        accountId: 'offlineContext_accountId',
        cognitoIdentityId: request.headers['cognito-identity-id'] || 'offlineContext_cognitoIdentityId',
        caller: 'offlineContext_caller',
        apiKey: 'offlineContext_apiKey',
        sourceIp: request.info.remoteAddress,
        cognitoAuthenticationType: 'offlineContext_cognitoAuthenticationType',
        cognitoAuthenticationProvider: request.headers['cognito-authentication-provider'] || 'offlineContext_cognitoAuthenticationProvider',
        userArn: 'offlineContext_userArn',
        userAgent: request.headers['user-agent'] || '',
        user: 'offlineContext_user',
      },
      authorizer: authAuthorizer || Object.assign(authContext, { // 'principalId' should have higher priority
        principalId: authPrincipalId || process.env.PRINCIPAL_ID || 'offlineContext_authorizer_principalId', // See #24
        claims,
      }),
      protocol: 'HTTP/1.1',
      resourcePath: request.route.path,
      httpMethod: request.method.toUpperCase(),
    },
    resource: request.route.path,
    httpMethod: request.method.toUpperCase(),
    queryStringParameters: utils.nullIfEmpty(utils.normalizeQuery(request.query)),
    multiValueQueryStringParameters: utils.nullIfEmpty(utils.normalizeMultiValueQuery(request.query)),
    stageVariables: utils.nullIfEmpty(stageVariables),
    body,
  };
};
