'use strict';

const AWS = require('aws-sdk');

const ddb = (() => {
  if (process.env.IS_OFFLINE) { 
    const AWSDynamoDBDocumentClientTester = require('../support/AWSDynamoDBDocumentClientMock');
    
    return new AWSDynamoDBDocumentClientTester();
  }

  return new AWS.DynamoDB.DocumentClient();
})();

const successfullResponse = {
  statusCode: 200,
  body: 'Request is OK.',
};

// const errorResponse = {
//   statusCode: 400,
//   body: 'Request is not OK.'
// };

const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};

module.exports.connect = async (/* event, context */) => successfullResponse;

module.exports.authCB = (event, context, callback) => {
  // console.log('authCB:');
  const token = event.headers.Auth;
  
  if (token === 'allow') callback(null, generatePolicy('user', 'Allow', event.methodArn));
  else callback(null, generatePolicy('user', 'Deny', event.methodArn));
};

module.exports.auth = async event => {
  // console.log('auth:');
  const listener = await ddb.get({ TableName:'data', Key:{ name:'default' } }).promise();
  if (listener.Item) {
    const timeout = new Promise(resolve => setTimeout(resolve, 100));
    const send = sendToClient( // sendToClient won't return on AWS when client doesn't exits so we set a timeout
      JSON.stringify({ action:'update', event:'auth', info:{ id:event.requestContext.connectionId, event } }), 
      listener.Item.id, 
      newAWSApiGatewayManagementApi(event)).catch(() => {});
    await Promise.race([send, timeout]);
  }
 
  const auth = event.headers.Auth123;
  if (auth) {
    const time = parseInt(auth);
    if (isNaN(time)) throw NaN; // eslint-disable-line no-restricted-globals
    if ((Date.now() - time) < 1000 * 60) return generatePolicy('user', 'Allow', event.methodArn);
  }
  
  return generatePolicy('user', 'Deny', event.methodArn);
};

module.exports.echo = async (event, context) => {
  // console.log(event);
  const action = JSON.parse(event.body);
  await sendToClient(action.message, event.requestContext.connectionId, newAWSApiGatewayManagementApi(event, context)).catch(err => console.log(err));

  return successfullResponse; 
};

module.exports.registerListener = async (event, context) => {
  await ddb.put({ TableName:'data', Item:{ name:'default', id:event.requestContext.connectionId } }).promise();
  await sendToClient({ action:'update', event:'register-listener', info:{ id:event.requestContext.connectionId } }, event.requestContext.connectionId, newAWSApiGatewayManagementApi(event, context)).catch(err => console.log(err));

  return successfullResponse; 
};

module.exports.deleteListener = async (/* event, context */) => {
  await ddb.delete({ TableName:'data', Key:{ name:'default' } }).promise();

  return successfullResponse;  
};

const newAWSApiGatewayManagementApi = event /* , context */ => {
  const endpoint = process.env.IS_OFFLINE ? 'http://localhost:3003' : `${event.requestContext.domainName}/${event.requestContext.stage}`;
  const apiVersion = '2018-11-29';

  return new AWS.ApiGatewayManagementApi({ apiVersion, endpoint });
};

const sendToClient = (data, connectionId, apigwManagementApi) => {
  // console.log(`sendToClient:${connectionId} data=${data}`);
  let sendee = data;
  if (typeof data === 'object') sendee = JSON.stringify(data);

  return apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: sendee }).promise();
};
