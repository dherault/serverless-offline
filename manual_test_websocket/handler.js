'use strict';

const AWS = require('aws-sdk');
const ddb = (()=>{
  if (process.env.IS_OFFLINE) return new AWS.DynamoDB.DocumentClient({region: "localhost", endpoint: "http://localhost:8000"});
  return new AWS.DynamoDB.DocumentClient();
})();


const successfullResponse = {
  statusCode: 200,
  body: 'Request is OK.'
};

const errorResponse = {
  statusCode: 400,
  body: 'Request is not OK.'
};

module.exports.connect = async (event, context) => {
  const listener=await ddb.get({TableName:'listeners', Key:{name:'default'}}).promise();
  if (listener.Item) await sendToClient(JSON.stringify({action:'update', event:'connect', info:{id:event.requestContext.connectionId}}), listener.Item.id, newAWSApiGatewayManagementApi(event, context)).catch(()=>{});
  return successfullResponse; 
};

module.exports.disconnect = async (event, context) => {
  const listener=await ddb.get({TableName:'listeners', Key:{name:'default'}}).promise();
  if (listener.Item) await sendToClient(JSON.stringify({action:'update', event:'disconnect', info:{id:event.requestContext.connectionId}}), listener.Item.id, newAWSApiGatewayManagementApi(event, context)).catch(()=>{});
  return successfullResponse; 
};

module.exports.defaultHandler = async (event, context) => {
  await sendToClient(`Error: No Supported Action in Payload '${event.body}'`, event.requestContext.connectionId, newAWSApiGatewayManagementApi(event, context)).catch(err=>console.log(err));
  return successfullResponse; 
};

module.exports.getClientInfo = async (event, context) => {
  await sendToClient({action:'update', event:'client-info', info:{id:event.requestContext.connectionId}}, event.requestContext.connectionId, newAWSApiGatewayManagementApi(event, context)).catch(err=>console.log(err));
  return successfullResponse; 
};

module.exports.makeError = async (event, context) => {
  const obj=null;
  obj.non.non=1;
  return successfullResponse; 
};

module.exports.multiCall1 = async (event, context) => {
  await sendToClient({action:'update', event:'made-call-1'}, event.requestContext.connectionId, newAWSApiGatewayManagementApi(event, context)).catch(err=>console.log(err));
  return successfullResponse; 
};

module.exports.multiCall2 = async (event, context) => {
  await sendToClient({action:'update', event:'made-call-2'}, event.requestContext.connectionId, newAWSApiGatewayManagementApi(event, context)).catch(err=>console.log(err));
  return successfullResponse; 
};


module.exports.send = async (event, context) => {
  const action = JSON.parse(event.body);
  const sents=[];
  action.clients.forEach((connectionId)=>{ 
    const sent=sendToClient(action.data, connectionId, newAWSApiGatewayManagementApi(event, context));
    sents.push(sent);
  });
  const noErr=await Promise.all(sents).then(()=>true).catch(()=>false);
  if (!noErr) await sendToClient('Error: Could not Send all Messages', event.requestContext.connectionId, newAWSApiGatewayManagementApi(event, context));
  return successfullResponse; 
};

module.exports.registerListener = async (event, context) => {
  await ddb.put({TableName:'listeners', Item:{name:'default', id:event.requestContext.connectionId}}).promise();
  await sendToClient({action:'update', event:'register-listener', info:{id:event.requestContext.connectionId}}, event.requestContext.connectionId, newAWSApiGatewayManagementApi(event, context)).catch(err=>console.log(err));
  return successfullResponse; 
};

module.exports.deleteListener = async (event, context) => {
  await ddb.delete({TableName:'listeners', Key:{name:'default'}}).promise();

  return successfullResponse;  
};

const newAWSApiGatewayManagementApi=(event, context)=>{
  const endpoint=event.requestContext.domainName+'/'+event.requestContext.stage;
  const apiVersion='2018-11-29';
  let API=context.API;
  if (!process.env.IS_OFFLINE) {
    API = require('aws-sdk');
    require('aws-sdk/clients/apigatewaymanagementapi'); 
  }
  return new API.ApiGatewayManagementApi({ apiVersion, endpoint });
};

const sendToClient = (data, connectionId, apigwManagementApi) => {
  let sendee=data;
  if ('object'==typeof data) sendee=JSON.stringify(data);

  return apigwManagementApi.postToConnection({ConnectionId: connectionId, Data: sendee}).promise();
};
