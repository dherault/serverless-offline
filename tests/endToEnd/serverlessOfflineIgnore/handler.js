'use strict'

exports.ignoredfunction = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      foo: 'bar',
    }),
  }
}

exports.legitfunction = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      foo: 'bar',
    }),
  }
}