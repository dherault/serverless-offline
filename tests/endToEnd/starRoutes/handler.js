'use strict'

const { stringify } = JSON

exports.hello = async () => {
  return {
    statusCode: 200,
    body: stringify({
      foo: 'bar',
    }),
  }
}
