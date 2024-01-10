"use strict"

const { stringify } = JSON

exports.hello = function hello(event, context, callback) {
  const response = {
    body: stringify({
      input: event,
      message: "Go Serverless v1.0! Your function executed successfully!",
    }),
    statusCode: 200,
  }

  callback(null, response)
}

exports.rejectedPromise = function rejectedPromise(event, context, callback) {
  const response = {
    body: stringify({
      input: event,
      message: "Go Serverless v1.0! Your function executed successfully!",
    }),
    statusCode: 200,
  }

  console.log("About to reject promise")

  Promise.reject(new Error("This is the rejected error"))

  callback(null, response)
}

exports.authFunction = function authFunction(event, context) {
  context.succeed({
    policyDocument: {
      // example policy shown below, but this value is any valid policy
      Statement: [
        {
          Action: ["execute-api:Invoke"],
          Effect: "Allow",
          Resource: [event.methodArn],
        },
      ],
      Version: "2012-10-17",
    },
    principalId: "xxxxxxx", // the principal user identification associated with the token send by the client
  })
}

exports.hello500 = function hello500(event, context, callback) {
  const response = {
    body: stringify({
      input: event,
      message: "Fake internal server error.",
    }),
    statusCode: 500,
  }

  callback(null, response)
}

exports.helloLambdaIntegration = function helloLambdaIntegration(
  event,
  context,
  cb,
) {
  cb(null, {
    event,
    message: "Go Serverless v1.0! Your function executed successfully!",
  })
}

exports.helloLambdaIntegration500 = function helloLambdaIntegration500(
  event,
  context,
  cb,
) {
  cb(new Error("[500] Fake internal server error."))
}

exports.basicAuthentication = function basicAuthentication(event, context, cb) {
  const response = {
    body: stringify({
      message: "Private Function Executed Correctly",
    }),
    statusCode: 200,
  }

  cb(null, response)
}

exports.catchAll = function catchAll(event, context, cb) {
  const response = {
    body: stringify({
      message: "Catch all route",
    }),
    statusCode: 200,
  }

  cb(null, response)
}

exports.pathParams = function pathParams(event, context, cb) {
  const response = {
    body: stringify({
      message: `id is ${event.pathParameters.id}`,
    }),
    statusCode: 200,
  }

  cb(null, response)
}

exports.failure = function failure() {
  throw new Error("Unexpected error!")
}
