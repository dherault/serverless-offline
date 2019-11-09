'use strict'

const { config, Lambda } = require('aws-sdk')

const { stringify } = JSON

config.update({
  accessKeyId: 'ABC',
  secretAccessKey: 'SECRET',
})

const lambda = new Lambda({
  apiVersion: '2015-03-31',
  endpoint: 'http://localhost:3000',
})

exports.testHandler = async function testHandler() {
  const params = {
    FunctionName: 'lambda-invoke-tests-dev-invokedHandler',
    InvocationType: 'RequestResponse',
    Payload: stringify({ foo: 'bar' }),
  }

  const response = await lambda.invoke(params).promise()

  return {
    body: stringify(response),
    statusCode: 200,
  }
}

exports.invokedHandler = async function invokedHandler(event) {
  return event
}
