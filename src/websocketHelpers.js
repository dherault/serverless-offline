const { randomId } = require('./utils');

const createRequestContext = (action, eventType, connection) => {
  const now = new Date();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const requestContext = { 
    routeKey: action,
    messageId: `${randomId()}`,
    eventType,
    extendedRequestId: `${randomId()}`,
    requestTime: `${now.getUTCDate()}/${months[now.getUTCMonth()]}/${now.getUTCFullYear()}:${now.getUTCHours()}:${now.getUTCMinutes()}:${now.getSeconds()} +0000`,
    messageDirection: 'IN',
    stage: 'local',
    connectedAt: connection.connectionTime,
    requestTimeEpoch: now.getTime(),
    identity:
      { cognitoIdentityPoolId: null,
        cognitoIdentityId: null,
        principalOrgId: null,
        cognitoAuthenticationType: null,
        userArn: null,
        userAgent: null,
        accountId: null,
        caller: null,
        sourceIp: '127.0.0.1',
        accessKey: null,
        cognitoAuthenticationProvider: null,
        user: null },
    requestId: `${randomId()}`,
    domainName: 'localhost',
    connectionId:connection.connectionId,
    apiId: 'private', 
  };
  
  return requestContext;
};

module.exports.createEvent = (action, eventType, connection, payload, options) => {
  const event = { 
    requestContext: createRequestContext(action, eventType, connection),
    body: JSON.stringify(payload),
    isBase64Encoded: false,
    apiGatewayUrl: `http${options.httpsProtocol ? 's' : ''}://${options.host}:${options.port + 1}`,
  };
  
  return event;
};

module.exports.createConnectEvent = (action, eventType, connection, options) => {
  const headers = { 
    Host: 'localhost',
    'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
    'Sec-WebSocket-Key': `${randomId()}`,
    'Sec-WebSocket-Version': '13',
    'X-Amzn-Trace-Id': `Root=${randomId()}`,
    'X-Forwarded-For': '127.0.0.1',
    'X-Forwarded-Port': `${options.port + 1}`,
    'X-Forwarded-Proto': `http${options.httpsProtocol ? 's' : ''}`, 
  };
  const multiValueHeaders = { ...headers };
  Object.keys(multiValueHeaders).map(key => multiValueHeaders[key] = [multiValueHeaders[key]]);
  const event = { 
    headers,
    multiValueHeaders,
    requestContext: createRequestContext(action, eventType, connection),
    apiGatewayUrl: `http${options.httpsProtocol ? 's' : ''}://${options.host}:${options.port + 1}`,
    isBase64Encoded: false,
  };
    
  return event;
};

module.exports.createDisconnectEvent = (action, eventType, connection, options) => {
  const headers = { 
    Host: 'localhost',
    'x-api-key': '',
    'x-restapi': '',
  };
  const multiValueHeaders = { ...headers };
  Object.keys(multiValueHeaders).map(key => multiValueHeaders[key] = [multiValueHeaders[key]]);
  const event = { 
    headers,
    multiValueHeaders,
    requestContext: createRequestContext(action, eventType, connection),
    apiGatewayUrl: `http${options.httpsProtocol ? 's' : ''}://${options.host}:${options.port + 1}`,
    isBase64Encoded: false,
  };
    
  return event;
};

module.exports.createContext = action => {
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
