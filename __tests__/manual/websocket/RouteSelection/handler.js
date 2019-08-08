'use strict';

const AWS = require('aws-sdk');

const successfullResponse = {
  body: 'Request is OK.',
  statusCode: 200,
};

exports.echo = async function echo(event, context) {
  const action = JSON.parse(event.body);

  await sendToClient(
    action.message,
    event.requestContext.connectionId,
    newAWSApiGatewayManagementApi(event, context),
  );

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
