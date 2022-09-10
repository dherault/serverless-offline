import { Buffer } from 'node:buffer'
// eslint-disable-next-line import/no-extraneous-dependencies
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

export async function invokeAsync() {
  const args = stringify({ foo: 'foo' })

  const params = {
    FunctionName: 'lambda-invoke-tests-dev-invokedAsyncHandler',
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
