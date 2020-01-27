'use strict'

const { stringify } = JSON

exports.lambdaIntegrationJson = async function lambdaIntegrationJson() {
  return {
    foo: 'bar',
  }
}

exports.lambdaIntegrationStringified = async function lambdaIntegrationStringified() {
  return stringify({
    foo: 'bar',
  })
}
