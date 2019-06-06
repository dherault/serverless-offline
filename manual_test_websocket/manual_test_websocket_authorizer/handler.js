'use strict';

const AWS = require('aws-sdk');

const successfullResponse = {
  statusCode: 200,
  body: 'Request is OK.'
};

const errorResponse = {
  statusCode: 400,
  body: 'Request is not OK.'
};

const generatePolicy = function(principalId, effect, resource) {
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


module.exports.connect = async (event, context) => {
  // console.log('connect:');
  return successfullResponse; 
};

module.export.auth = (event, context, callback) => {
  //console.log('auth:');
  const token = event.headers["Authorization"];
  
  if ('deny'===token) callback(null, generatePolicy('user', 'Deny', event.methodArn));
  else callback(null, generatePolicy('user', 'Allow', event.methodArn));;
};

const newAWSApiGatewayManagementApi=(event, context)=>{
  let endpoint=event.apiGatewayUrl;

  if (!endpoint) endpoint = event.requestContext.domainName+'/'+event.requestContext.stage;
  const apiVersion='2018-11-29';
  return new AWS.ApiGatewayManagementApi({ apiVersion, endpoint });
};

const sendToClient = (data, connectionId, apigwManagementApi) => {
  // console.log(`sendToClient:${connectionId}`);
  let sendee=data;
  if ('object'==typeof data) sendee=JSON.stringify(data);

  return apigwManagementApi.postToConnection({ConnectionId: connectionId, Data: sendee}).promise();
};
