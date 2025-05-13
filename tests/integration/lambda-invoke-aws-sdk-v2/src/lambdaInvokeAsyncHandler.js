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

export async function invokeAsync() {
  const args = stringify({
    foo: "foo",
  })

  const params = {
    FunctionName: "lambda-invoke-aws-sdk-v2-tests-dev-invokedAsyncHandler",
    InvokeArgs: Buffer.from(args),
  }

  const response = await lambda.invokeAsync(params).promise()

  return {
    body: stringify(response),
    statusCode: 200,
  }
}

export async function invokedAsyncHandler(event) {
  return {
    // TODO include event in test!
    event,
  }
}
