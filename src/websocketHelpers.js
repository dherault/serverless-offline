const { DateTime } = require('luxon');
const { getUniqueId } = require('./utils');

// TODO this should be probably moved to utils, and combined with other header
// functions and utilities
function createMultiValueHeaders(headers) {
  return Object.entries(headers).reduce((acc, [key, value]) => {
    acc[key] = [value];

    return acc;
  }, {});
}

// CLF -> Common Log Format
// https://httpd.apache.org/docs/1.3/logs.html#common
// [day/month/year:hour:minute:second zone]
// day = 2*digit
// month = 3*letter
// year = 4*digit
// hour = 2*digit
// minute = 2*digit
// second = 2*digit
// zone = (`+' | `-') 4*digit
function formatToClfTime(date) {
  return DateTime.fromJSDate(date).toFormat('dd/MMM/yyyy:HH:mm:ss ZZZ');
}

const createRequestContext = (action, eventType, connection) => {
  const now = new Date();

  const requestContext = {
    apiId: 'private',
    connectedAt: connection.connectionTime,
    connectionId:connection.connectionId,
    domainName: 'localhost',
    eventType,
    extendedRequestId: `${getUniqueId()}`,
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
    messageId: `${getUniqueId()}`,
    requestId: `${getUniqueId()}`,
    requestTime: formatToClfTime(now),
    requestTimeEpoch: now.getTime(),
    routeKey: action,
    stage: 'local',
  };

  return requestContext;
};

exports.createEvent = (action, eventType, connection, payload, options) => {
  const event = {
    apiGatewayUrl: `http${options.httpsProtocol ? 's' : ''}://${options.host}:${options.port + 1}`,
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
    'Sec-WebSocket-Key': `${getUniqueId()}`,
    'Sec-WebSocket-Version': '13',
    'X-Amzn-Trace-Id': `Root=${getUniqueId()}`,
    'X-Forwarded-For': '127.0.0.1',
    'X-Forwarded-Port': `${options.port + 1}`,
    'X-Forwarded-Proto': `http${options.httpsProtocol ? 's' : ''}`,
  };
  const multiValueHeaders = createMultiValueHeaders(headers);
  const event = {
    apiGatewayUrl: `http${options.httpsProtocol ? 's' : ''}://${options.host}:${options.port + 1}`,
    headers,
    isBase64Encoded: false,
    multiValueHeaders,
    requestContext: createRequestContext(action, eventType, connection),
  };

  return event;
};

exports.createDisconnectEvent = (action, eventType, connection, options) => {
  const headers = {
    Host: 'localhost',
    'x-api-key': '',
    'x-restapi': '',
  };
  const multiValueHeaders = createMultiValueHeaders(headers);
  const event = {
    apiGatewayUrl: `http${options.httpsProtocol ? 's' : ''}://${options.host}:${options.port + 1}`,
    headers,
    isBase64Encoded: false,
    multiValueHeaders,
    requestContext: createRequestContext(action, eventType, connection),
  };

  return event;
};

exports.createContext = action => {
  const context = {
    awsRequestId: `offline_awsRequestId_for_${action}`,
    callbackWaitsForEmptyEventLoop: true,
    functionName: action,
    functionVersion: '$LATEST',
    invokedFunctionArn: `offline_invokedFunctionArn_for_${action}`,
    invokeid: `offline_invokeid_for_${action}`,
    logGroupName: `offline_logGroupName_for_${action}`,
    logStreamName: `offline_logStreamName_for_${action}`,
    memoryLimitInMB: '1024',
  };

  return context;
};
