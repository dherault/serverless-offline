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

exports.invokeAsync = async function invokeAsync() {
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

exports.invokedAsyncHandler = async function invokedAsyncHandler(event) {
  return {
    // TODO include event in test!
    event,
  }
}
