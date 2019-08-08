'use strict';

const AWS = require('aws-sdk');

const ddb = (() => {
  if (process.env.IS_OFFLINE)
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
    });

  return new AWS.DynamoDB.DocumentClient();
})();

const successfullResponse = {
  statusCode: 200,
  body: 'Request is OK.',
};

exports.connect = async function connect(event, context) {
  // console.log('connect:');
  const listener = await ddb
    .get({ TableName: 'listeners', Key: { name: 'default' } })
    .promise();

  if (listener.Item) {
    const timeout = new Promise((resolve) => setTimeout(resolve, 100));
    const send = sendToClient(
      // sendToClient won't return on AWS when client doesn't exits so we set a timeout
      JSON.stringify({
        action: 'update',
        event: 'connect',
        info: {
          id: event.requestContext.connectionId,
          event: { ...event },
          context,
        },
      }),
      listener.Item.id,
      newAWSApiGatewayManagementApi(event, context),
    ).catch(() => {});
    await Promise.race([send, timeout]);
  }

  return successfullResponse;
};

// export.auth = function auth(event, context, callback) {
//   //console.log('auth:');
//   const token = event.headers["Authorization"];

//   if ('deny'===token) callback(null, generatePolicy('user', 'Deny', event.methodArn));
//   else callback(null, generatePolicy('user', 'Allow', event.methodArn));;
// };

exports.disconnect = async function disconnect(event, context) {
  const listener = await ddb
    .get({ TableName: 'listeners', Key: { name: 'default' } })
    .promise();
  if (listener.Item)
    await sendToClient(
      JSON.stringify({
        action: 'update',
        event: 'disconnect',
        info: {
          id: event.requestContext.connectionId,
          event: { ...event },
          context,
        },
      }),
      listener.Item.id,
      newAWSApiGatewayManagementApi(event, context),
    ).catch(() => {});

  return successfullResponse;
};

exports.defaultHandler = async function defaultHandler(event, context) {
  await sendToClient(
    `Error: No Supported Action in Payload '${event.body}'`,
    event.requestContext.connectionId,
    newAWSApiGatewayManagementApi(event, context),
  ).catch((err) => console.log(err));

  return successfullResponse;
};

exports.getClientInfo = async function getClientInfo(event, context) {
  // console.log('getClientInfo:');
  await sendToClient(
    {
      action: 'update',
      event: 'client-info',
      info: { id: event.requestContext.connectionId },
    },
    event.requestContext.connectionId,
    newAWSApiGatewayManagementApi(event, context),
  ).catch((err) => console.log(err));

  return successfullResponse;
};

exports.getCallInfo = async function getCallInfo(event, context) {
  await sendToClient(
    {
      action: 'update',
      event: 'call-info',
      info: { event: { ...event }, context },
    },
    event.requestContext.connectionId,
    newAWSApiGatewayManagementApi(event, context),
  ).catch((err) => console.log(err));

  return successfullResponse;
};

exports.makeError = async function makeError() {
  const obj = null;
  obj.non.non = 1;

  return successfullResponse;
};

exports.replyViaCallback = function replyViaCallback(event, context, callback) {
  sendToClient(
    { action: 'update', event: 'reply-via-callback' },
    event.requestContext.connectionId,
    newAWSApiGatewayManagementApi(event, context),
  ).catch((err) => console.log(err));
  callback();
};

exports.replyErrorViaCallback = function replyErrorViaCallback(
  event,
  context,
  callback,
) {
  callback('error error error');
};

exports.multiCall1 = async function multiCall1(event, context) {
  await sendToClient(
    { action: 'update', event: 'made-call-1' },
    event.requestContext.connectionId,
    newAWSApiGatewayManagementApi(event, context),
  ).catch((err) => console.log(err));

  return successfullResponse;
};

exports.multiCall2 = async function multiCall2(event, context) {
  await sendToClient(
    { action: 'update', event: 'made-call-2' },
    event.requestContext.connectionId,
    newAWSApiGatewayManagementApi(event, context),
  ).catch((err) => console.log(err));

  return successfullResponse;
};

exports.send = async function send(event, context) {
  const action = JSON.parse(event.body);
  const sents = [];
  action.clients.forEach((connectionId) => {
    const sent = sendToClient(
      action.data,
      connectionId,
      newAWSApiGatewayManagementApi(event, context),
    );
    sents.push(sent);
  });

  const noErr = await Promise.all(sents)
    .then(() => true)
    .catch(() => false);

  if (!noErr)
    await sendToClient(
      'Error: Could not Send all Messages',
      event.requestContext.connectionId,
      newAWSApiGatewayManagementApi(event, context),
    );

  return successfullResponse;
};

exports.registerListener = async function registerListener(event, context) {
  await ddb
    .put({
      TableName: 'listeners',
      Item: { name: 'default', id: event.requestContext.connectionId },
    })
    .promise();

  await sendToClient(
    {
      action: 'update',
      event: 'register-listener',
      info: { id: event.requestContext.connectionId },
    },
    event.requestContext.connectionId,
    newAWSApiGatewayManagementApi(event, context),
  ).catch((err) => console.log(err));

  return successfullResponse;
};

exports.deleteListener = async function deleteListener() {
  await ddb
    .delete({ TableName: 'listeners', Key: { name: 'default' } })
    .promise();

  return successfullResponse;
};

function newAWSApiGatewayManagementApi(event) {
  const endpoint = `${event.requestContext.domainName}/${event.requestContext.stage}`;
  const apiVersion = '2018-11-29';

  return new AWS.ApiGatewayManagementApi({ apiVersion, endpoint });
}

function sendToClient(data, connectionId, apigwManagementApi) {
  // console.log(`sendToClient:${connectionId}`);
  let sendee = data;
  if (typeof data === 'object') sendee = JSON.stringify(data);

  return apigwManagementApi
    .postToConnection({ ConnectionId: connectionId, Data: sendee })
    .promise();
}
