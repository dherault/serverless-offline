import { Buffer } from 'node:buffer'
import aws from 'aws-sdk'

const { stringify } = JSON

aws.config.update({
  accessKeyId: 'ABC',
  secretAccessKey: 'SECRET',
})

const lambda = new aws.Lambda({
  apiVersion: '2015-03-31',
  endpoint: 'http://localhost:3002',
})

export async function hello() {
  const clientContextData = stringify({
    foo: 'foo',
  })

  const params = {
    ClientContext: Buffer.from(clientContextData).toString('base64'),
    FunctionName: 'lambda-invoke-dev-toBeInvoked',
    InvocationType: 'RequestResponse',
    Payload: stringify({
      bar: 'bar',
    }),
  }

  const response = await lambda.invoke(params).promise()

  return {
    body: stringify(response),
    statusCode: 200,
  }
}

export async function toBeInvoked(event, context) {
  return {
    clientContext: context.clientContext,
    event,
  }
}
