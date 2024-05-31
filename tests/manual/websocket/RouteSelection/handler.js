"use strict"

const { ApiGatewayManagementApi } = require("aws-sdk")

const { parse, stringify } = JSON

const successfullResponse = {
  body: "Request is OK.",
  statusCode: 200,
}

function sendToClient(data, connectionId, apigwManagementApi) {
  // console.log(`sendToClient:${connectionId}`);
  let sendee = data
  if (typeof data === "object") sendee = stringify(data)

  return apigwManagementApi
    .postToConnection({ ConnectionId: connectionId, Data: sendee })
    .promise()
}

function newAWSApiGatewayManagementApi(event) {
  const endpoint = `${event.requestContext.domainName}/${event.requestContext.stage}`
  const apiVersion = "2018-11-29"

  return new ApiGatewayManagementApi({ apiVersion, endpoint })
}

exports.echo = async function echo(event, context) {
  const action = parse(event.body)

  await sendToClient(
    action.message,
    event.requestContext.connectionId,
    newAWSApiGatewayManagementApi(event, context),
  )

  return successfullResponse
}
