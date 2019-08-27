'use strict'

const { createUniqueId, formatToClfTime } = require('./utils/index.js')

const { now } = Date
const { stringify } = JSON

// TODO this should be probably moved to utils, and combined with other header
// functions and utilities
function createMultiValueHeaders(headers) {
  return Object.entries(headers).reduce((acc, [key, value]) => {
    acc[key] = [value]

    return acc
  }, {})
}

function createRequestContext(action, eventType, connectionId) {
  const timeEpoch = now()

  const requestContext = {
    apiId: 'private',
    connectedAt: now(), // TODO this is probably not correct, and should be the initial connection time?
    connectionId,
    domainName: 'localhost',
    eventType,
    extendedRequestId: createUniqueId(),
    identity: {
      accessKey: null,
      accountId: null,
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
    messageId: createUniqueId(),
    requestId: createUniqueId(),
    requestTime: formatToClfTime(timeEpoch),
    requestTimeEpoch: timeEpoch,
    routeKey: action,
    stage: 'local',
  }

  return requestContext
}

exports.createEvent = function createEvent(
  action,
  eventType,
  connectionId,
  payload,
) {
  const event = {
    body: stringify(payload),
    isBase64Encoded: false,
    requestContext: createRequestContext(action, eventType, connectionId),
  }

  return event
}

exports.createConnectEvent = function createConnectEvent(
  action,
  eventType,
  connectionId,
  options,
) {
  const headers = {
    Host: 'localhost',
    'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
    'Sec-WebSocket-Key': createUniqueId(),
    'Sec-WebSocket-Version': '13',
    'X-Amzn-Trace-Id': `Root=${createUniqueId()}`,
    'X-Forwarded-For': '127.0.0.1',
    'X-Forwarded-Port': String(options.websocketPort),
    'X-Forwarded-Proto': `http${options.httpsProtocol ? 's' : ''}`,
  }
  const multiValueHeaders = createMultiValueHeaders(headers)
  const event = {
    headers,
    isBase64Encoded: false,
    multiValueHeaders,
    requestContext: createRequestContext(action, eventType, connectionId),
  }

  return event
}

exports.createDisconnectEvent = function createDisconnectEvent(
  action,
  eventType,
  connectionId,
) {
  const headers = {
    Host: 'localhost',
    'x-api-key': '',
    'x-restapi': '',
  }
  const multiValueHeaders = createMultiValueHeaders(headers)
  const event = {
    headers,
    isBase64Encoded: false,
    multiValueHeaders,
    requestContext: createRequestContext(action, eventType, connectionId),
  }

  return event
}
