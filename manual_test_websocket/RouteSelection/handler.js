const AWS = require('aws-sdk');

const successfullResponse = {
  statusCode: 200,
  body: 'Request is OK.',
};

module.exports.echo = async (event, context) => {
  const action = JSON.parse(event.body);

  await sendToClient(action.message, event.requestContext.connectionId, newAWSApiGatewayManagementApi(event, context));

  return successfullResponse;
};

const newAWSApiGatewayManagementApi = event => {
  let endpoint = event.apiGatewayUrl;

  if (!endpoint) endpoint = `${event.requestContext.domainName}/${event.requestContext.stage}`;
  const apiVersion = '2018-11-29';

  return new AWS.ApiGatewayManagementApi({ apiVersion, endpoint });
};

const sendToClient = (data, connectionId, apigwManagementApi) => {
  // console.log(`sendToClient:${connectionId}`);
  let sendee = data;
  if (typeof data === 'object') sendee = JSON.stringify(data);

  return apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: sendee }).promise();
};
