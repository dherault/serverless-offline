import { Buffer } from "node:buffer"
import { env } from "node:process"
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda"

const { stringify } = JSON

const lambdaClient = new LambdaClient({
  apiVersion: "2015-03-31",
  credentials: {
    accessKeyId: "ABC",
    secretAccessKey: "SECRET",
  },
  ...(env.IS_OFFLINE && {
    endpoint: "http://localhost:3002",
  }),
  // region: 'local',
})

export async function invokeInvocationTypeEvent() {
  const invokeCommand = new InvokeCommand({
    FunctionName: "lambda-invoke-aws-sdk-v3-tests-dev-invokedHandler",
    InvocationType: "Event",
    // Payload: undefined,
  })

  const response = await lambdaClient.send(invokeCommand)

  return {
    body: stringify({
      Payload: new TextDecoder("utf8").decode(response.Payload),
      StatusCode: response.StatusCode,
    }),
  }
}

export async function invokeInvocationTypeRequestResponse() {
  const invokeCommand = new InvokeCommand({
    // ClientContext: undefined,
    FunctionName: "lambda-invoke-aws-sdk-v3-tests-dev-invokedHandler",
    InvocationType: "RequestResponse",
    // Payload: undefined,
  })

  const response = await lambdaClient.send(invokeCommand)

  return {
    body: stringify({
      Payload: new TextDecoder("utf8").decode(response.Payload),
      StatusCode: response.StatusCode,
    }),
    statusCode: 200,
  }
}

export async function invokeFunctionDoesNotExist() {
  const invokeCommand = new InvokeCommand({
    // ClientContext: undefined,
    FunctionName: "function-does-not-exist",
    InvocationType: "RequestResponse",
    // Payload: undefined,
  })

  try {
    await lambdaClient.send(invokeCommand)
  } catch (error) {
    return {
      body: stringify({
        error: {
          message: error.message,
          name: error.name,
          Type: error.Type,
        },
      }),
      statusCode: 200,
    }
  }

  return undefined
}

export async function invokeFunctionWithError() {
  const invokeCommand = new InvokeCommand({
    // ClientContext: undefined,
    FunctionName: "lambda-invoke-aws-sdk-v3-tests-dev-invokedHandlerWithError",
    InvocationType: "RequestResponse",
    // Payload: undefined,
  })

  try {
    await lambdaClient.send(invokeCommand)
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

  const payload = stringify({
    bar: "bar",
  })

  const invokeCommand = new InvokeCommand({
    ClientContext: Buffer.from(clientContextData).toString("base64"),
    FunctionName: "lambda-invoke-aws-sdk-v3-tests-dev-invokedHandler",
    InvocationType: "RequestResponse",
    Payload: new TextEncoder().encode(payload),
  })

  const response = await lambdaClient.send(invokeCommand)

  return {
    body: stringify({
      Payload: new TextDecoder("utf8").decode(response.Payload),
      StatusCode: response.StatusCode,
    }),
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
