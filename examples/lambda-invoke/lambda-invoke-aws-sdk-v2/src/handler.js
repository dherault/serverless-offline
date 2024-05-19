import { Buffer } from "node:buffer"
import aws from "aws-sdk"

const { stringify } = JSON

aws.config.update({
  accessKeyId: "ABC",
  secretAccessKey: "SECRET",
})

const lambda = new aws.Lambda({
  apiVersion: "2015-03-31",
  endpoint: "http://localhost:3002",
})

export async function hello() {
  const clientContextData = stringify({
    foo: "foo",
  })

  const payload = stringify({
    bar: "bar",
  })

  const params = {
    ClientContext: Buffer.from(clientContextData).toString("base64"),
    FunctionName: "lambda-invoke-aws-sdk-v2-dev-toBeInvoked",
    InvocationType: "RequestResponse",
    Payload: payload,
  }

  const response = await lambda.invoke(params).promise()

  return {
    body: response.Payload,
    statusCode: 200,
  }
}

export async function toBeInvoked(event, context) {
  return {
    clientContext: context.clientContext,
    event,
  }
}
