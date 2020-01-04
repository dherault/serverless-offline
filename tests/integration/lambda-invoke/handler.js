'use strict'

const { Buffer } = require('buffer')
const { config, Lambda } = require('aws-sdk')

const { stringify } = JSON

config.update({
  accessKeyId: 'ABC',
  secretAccessKey: 'SECRET',
})

const lambda = new Lambda({
  apiVersion: '2015-03-31',
  endpoint: 'http://localhost:3002',
})

exports.invokeInvocationTypeEvent = async function invokeInvocationTypeEvent() {
  const params = {
    // ClientContext: undefined,
    FunctionName: 'lambda-invoke-tests-dev-invokedHandler',
    InvocationType: 'Event',
    // Payload: undefined,
  }

  const response = await lambda.invoke(params).promise()

  return {
    body: stringify(response),
    statusCode: 200,
  }
}

exports.invokeInvocationTypeRequestResponse = async function invokeInvocationTypeRequestResponse() {
  const params = {
    // ClientContext: undefined,
    FunctionName: 'lambda-invoke-tests-dev-invokedHandler',
    InvocationType: 'RequestResponse',
    // Payload: undefined,
  }

  const response = await lambda.invoke(params).promise()

  return {
    body: stringify(response),
    statusCode: 200,
  }
}

exports.testHandler = async function testHandler() {
  const clientContextData = stringify({ foo: 'foo' })

  const params = {
    ClientContext: Buffer.from(clientContextData).toString('base64'),
    FunctionName: 'lambda-invoke-tests-dev-invokedHandler',
    InvocationType: 'RequestResponse',
    Payload: stringify({ bar: 'bar' }),
  }

  const response = await lambda.invoke(params).promise()

  return {
    body: stringify(response),
    statusCode: 200,
  }
}

exports.invokedHandler = async function invokedHandler(event, context) {
  return {
    clientContext: context.clientContext,
    event,
  }
}
