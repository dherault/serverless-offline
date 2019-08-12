'use strict';

const { decode } = require('jsonwebtoken');
const {
  normalizeMultiValueQuery,
  normalizeQuery,
  nullIfEmpty,
  createUniqueId,
} = require('./utils');

/*
 Mimicks the request context object
 http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html
 */
module.exports = function createLambdaProxyEvent(
  request,
  options,
  stageVariables,
) {
  const authPrincipalId =
    request.auth && request.auth.credentials && request.auth.credentials.principalId;
  const authContext =
    (request.auth &&
      request.auth.credentials &&
      request.auth.credentials.context) ||
    {};
  let authAuthorizer;

  if (process.env.AUTHORIZER) {
    try {
      authAuthorizer = JSON.parse(process.env.AUTHORIZER);
    } catch (error) {
      console.error(
        'Serverless-offline: Could not parse process.env.AUTHORIZER, make sure it is correct JSON.',
      );
    }
  }

  let body = request.payload;

  const headers = request.unprocessedHeaders;

  if (body) {
    if (typeof body !== 'string') {
      // JSON.stringify(JSON.parse(request.payload)) is NOT the same as the rawPayload
      body = request.rawPayload;
    }

    if (
      !headers['Content-Length'] &&
      !headers['content-length'] &&
      !headers['Content-length'] &&
      (typeof body === 'string' ||
        body instanceof Buffer ||
        body instanceof ArrayBuffer)
    ) {
      headers['Content-Length'] = Buffer.byteLength(body);
    }

    // Set a default Content-Type if not provided.
    if (
      !headers['Content-Type'] &&
      !headers['content-type'] &&
      !headers['Content-type']
    ) {
      headers['Content-Type'] = 'application/json';
    }
  } else if (typeof body === 'undefined' || body === '') {
    body = null;
  }

  // clone own props
  const pathParams = { ...request.params };

  let token = headers.Authorization || headers.authorization;

  if (token && token.split(' ')[0] === 'Bearer') {
    [, token] = token.split(' ');
  }

  let claims;

  if (token) {
    try {
      claims = decode(token) || undefined;
    } catch (err) {
      // Do nothing
    }
  }

  return {
    body,
    headers,
    httpMethod: request.method.toUpperCase(),
    multiValueHeaders: request.multiValueHeaders,
    multiValueQueryStringParameters: nullIfEmpty(
      normalizeMultiValueQuery(request.query),
    ),
    path: request.path,
    pathParameters: nullIfEmpty(pathParams),
    queryStringParameters: nullIfEmpty(normalizeQuery(request.query)),
    requestContext: {
      accountId: 'offlineContext_accountId',
      apiId: 'offlineContext_apiId',
      authorizer:
        authAuthorizer ||
        Object.assign(authContext, {
          // 'principalId' should have higher priority
          principalId:
            authPrincipalId ||
            process.env.PRINCIPAL_ID ||
            'offlineContext_authorizer_principalId', // See #24
          claims,
        }),
      httpMethod: request.method.toUpperCase(),
      identity: {
        accountId: process.env.SLS_ACCOUNT_ID || 'offlineContext_accountId',
        apiKey: process.env.SLS_API_KEY || 'offlineContext_apiKey',
        caller: process.env.SLS_CALLER || 'offlineContext_caller',
        cognitoAuthenticationProvider:
          request.headers['cognito-authentication-provider'] ||
          process.env.SLS_COGNITO_AUTHENTICATION_PROVIDER ||
          'offlineContext_cognitoAuthenticationProvider',
        cognitoAuthenticationType:
          process.env.SLS_COGNITO_AUTHENTICATION_TYPE ||
          'offlineContext_cognitoAuthenticationType',
        cognitoIdentityId:
          request.headers['cognito-identity-id'] ||
          process.env.SLS_COGNITO_IDENTITY_ID ||
          'offlineContext_cognitoIdentityId',
        cognitoIdentityPoolId:
          process.env.SLS_COGNITO_IDENTITY_POOL_ID ||
          'offlineContext_cognitoIdentityPoolId',
        sourceIp: request.info.remoteAddress,
        user: 'offlineContext_user',
        userAgent: request.headers['user-agent'] || '',
        userArn: 'offlineContext_userArn',
      },
      protocol: 'HTTP/1.1',
      requestId: `offlineContext_requestId_${createUniqueId()}`,
      requestTimeEpoch: request.info.received,
      resourceId: 'offlineContext_resourceId',
      resourcePath: request.route.path,
      stage: options.stage,
    },
    resource: request.route.path,
    stageVariables: nullIfEmpty(stageVariables),
  };
};
