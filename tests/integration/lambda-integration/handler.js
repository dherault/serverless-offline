'use strict'

const { stringify } = JSON

exports.lambdaIntegrationJson = async function lambdaIntegrationJson() {
  return {
    foo: 'bar',
  }
}

exports.lambdaIntegrationStringified =
  async function lambdaIntegrationStringified() {
    return stringify({
      foo: 'bar',
    })
  }

exports.lambdaIntegrationWithOperationName =
  async function lambdaIntegrationWithOperationName(event) {
    return {
      body: stringify({
        operationName: event.requestContext.operationName,
      }),
      statusCode: 200,
    }
  }
