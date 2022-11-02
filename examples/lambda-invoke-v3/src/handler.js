import { Buffer } from 'node:buffer'
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda'

const { stringify } = JSON

const lambdaClient = new LambdaClient({
  // credentials: {
  //   accessKeyId: 'ABC',
  //   secretAccessKey: 'SECRET',
  // },
  // apiVersion: '2015-03-31',
  // endpoint: 'http://localhost:3002',
  // region: 'local',
})

export async function hello() {
  const clientContext = stringify({
    foo: 'foo',
  })

  const payload = stringify({
    bar: 'bar',
  })

  const invokeCommand = new InvokeCommand({
    ClientContext: Buffer.from(clientContext).toString('base64'),
    FunctionName: 'lambda-invoke-dev-toBeInvoked',
    InvocationType: 'RequestResponse',
    Payload: new TextEncoder().encode(stringify(payload)),
  })

  const response = await lambdaClient.send(invokeCommand)

  return {
    body: new TextDecoder('utf-8').decode(response.Payload),
    statusCode: 200,
  }
}

export async function toBeInvoked(event, context) {
  return {
    clientContext: context.clientContext,
    event,
  }
}
