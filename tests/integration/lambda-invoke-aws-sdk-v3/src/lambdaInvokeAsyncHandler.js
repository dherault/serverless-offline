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

export async function invokeAsync() {
  const payload = stringify({
    foo: "foo",
  })

  const invokeCommand = new InvokeCommand({
    FunctionName: "lambda-invoke-aws-sdk-v3-tests-dev-invokedAsyncHandler",
    InvocationType: "Event",
    Payload: new TextEncoder().encode(payload),
  })

  const response = await lambdaClient.send(invokeCommand)

  return {
    body: stringify({
      Payload: response.Payload,
      StatusCode: response.StatusCode,
    }),
    statusCode: 200,
  }
}

export async function invokedAsyncHandler(event) {
  return {
    // TODO include event in test!
    event,
  }
}
