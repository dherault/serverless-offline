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

exports.hello = async function hello() {
  const params = {
    FunctionName: 'lambda-invoke-dev-toBeInvoked',
    InvocationType: 'RequestResponse',
    Payload: stringify({ foo: 'foo' }),
  }

  const response = await lambda.invoke(params).promise()

  return {
    body: stringify(response),
    statusCode: 200,
  }
}

exports.toBeInvoked = async function toBeInvoked(event) {
  return {
    bar: 'bar',
    ...event,
  }
}
