'use strict';

const { createUniqueId, formatToClfTime } = require('./utils');

// TODO this should be probably moved to utils, and combined with other header
// functions and utilities
function createMultiValueHeaders(headers) {
  return Object.entries(headers).reduce((acc, [key, value]) => {
    acc[key] = [value];

    return acc;
  }, {});
}

const createRequestContext = (action, eventType, connection) => {
  const now = new Date();

  const requestContext = {
    apiId: 'private',
    connectedAt: connection.connectionTime,
    connectionId: connection.connectionId,
    domainName: 'localhost',
    eventType,
    extendedRequestId: `${createUniqueId()}`,
    identity: {
      accountId: null,
      accessKey: null,
      caller: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: '127.0.0.1',
      user: null,
      userAgent: null,
      userArn: null,
    },
    messageDirection: 'IN',
    messageId: `${createUniqueId()}`,
    requestId: `${createUniqueId()}`,
    requestTime: formatToClfTime(now),
    requestTimeEpoch: now.getTime(),
    routeKey: action,
    stage: 'local',
  };

  return requestContext;
};

exports.createEvent = (action, eventType, connection, payload) => {
  const event = {
    body: JSON.stringify(payload),
    isBase64Encoded: false,
    requestContext: createRequestContext(action, eventType, connection),
  };

  return event;
};

exports.createConnectEvent = (action, eventType, connection, options) => {
  const headers = {
    Host: 'localhost',
    'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
    'Sec-WebSocket-Key': `${createUniqueId()}`,
    'Sec-WebSocket-Version': '13',
    'X-Amzn-Trace-Id': `Root=${createUniqueId()}`,
    'X-Forwarded-For': '127.0.0.1',
    'X-Forwarded-Port': String(options.websocketPort),
    'X-Forwarded-Proto': `http${options.httpsProtocol ? 's' : ''}`,
  };
  const multiValueHeaders = createMultiValueHeaders(headers);
  const event = {
    headers,
    isBase64Encoded: false,
    multiValueHeaders,
    requestContext: createRequestContext(action, eventType, connection),
  };

  return event;
};

exports.createDisconnectEvent = (action, eventType, connection) => {
  const headers = {
    Host: 'localhost',
    'x-api-key': '',
    'x-restapi': '',
  };
  const multiValueHeaders = createMultiValueHeaders(headers);
  const event = {
    headers,
    isBase64Encoded: false,
    multiValueHeaders,
    requestContext: createRequestContext(action, eventType, connection),
  };

  return event;
};
