"use strict"

const { stringify } = JSON

exports.echoAuthorizer = async function echoAuthorizer(context) {
  return {
    body: stringify(context.requestContext.authorizer),
    statusCode: 200,
  }
}
