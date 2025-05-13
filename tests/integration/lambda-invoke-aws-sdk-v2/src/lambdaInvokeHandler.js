import { Buffer } from "node:buffer"
import { env } from "node:process"
import aws from "aws-sdk"

const { stringify } = JSON

if (env.IS_OFFLINE) {
  aws.config.update({
    accessKeyId: "ABC",
    secretAccessKey: "SECRET",
  })
}

const lambda = new aws.Lambda({
  apiVersion: "2015-03-31",
  ...(env.IS_OFFLINE && {
    endpoint: "http://localhost:3002",
  }),
})

export async function invokeInvocationTypeEvent() {
  const params = {
    // ClientContext: undefined,
    FunctionName: "lambda-invoke-aws-sdk-v2-tests-dev-invokedHandler",
    InvocationType: "Event",
    // Payload: undefined,
  }

  const response = await lambda.invoke(params).promise()

  return {
    body: stringify(response),
    statusCode: 200,
  }
}

export async function invokeInvocationTypeRequestResponse() {
  const params = {
    // ClientContext: undefined,
    FunctionName: "lambda-invoke-aws-sdk-v2-tests-dev-invokedHandler",
    InvocationType: "RequestResponse",
    // Payload: undefined,
  }

  const response = await lambda.invoke(params).promise()

  return {
    body: stringify(response),
    statusCode: 200,
  }
}

export async function invokeFunctionDoesNotExist() {
  const params = {
    // ClientContext: undefined,
    FunctionName: "function-does-not-exist",
    InvocationType: "RequestResponse",
    // Payload: undefined,
  }

  try {
    await lambda.invoke(params).promise()
  } catch (error) {
    return {
      body: stringify({
        error: {
          code: error.code,
          message: error.message,
          statusCode: error.statusCode,
        },
      }),
      statusCode: error.statusCode,
    }
  }

  return undefined
}

export async function invokeFunctionWithError() {
  const params = {
    // ClientContext: undefined,
    FunctionName: "lambda-invoke-aws-sdk-v2-tests-dev-invokedHandlerWithError",
    InvocationType: "RequestResponse",
    // Payload: undefined,
  }

  try {
    await lambda.invoke(params).promise()
  } catch (error) {
    return {
      body: stringify({ error }),
      statusCode: 200,
    }
  }

  return undefined
}

export async function testHandler() {
  const clientContextData = stringify({
    foo: "foo",
  })

  const params = {
    ClientContext: Buffer.from(clientContextData).toString("base64"),
    FunctionName: "lambda-invoke-aws-sdk-v2-tests-dev-invokedHandler",
    InvocationType: "RequestResponse",
    Payload: stringify({
      bar: "bar",
    }),
  }

  const response = await lambda.invoke(params).promise()

  return {
    body: stringify(response),
    statusCode: 200,
  }
}

export async function invokedHandler(event, context) {
  return {
    clientContext: context.clientContext,
    event,
  }
}

export async function invokedHandlerWithError() {
  throw new Error("Unhandled Error message body")
}
