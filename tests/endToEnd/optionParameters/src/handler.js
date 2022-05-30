'use strict'

const { stringify } = JSON

exports.hello = async () => {
  return {
    body: stringify({
      foo: 'bar',
    }),
    statusCode: 200,
  }
}
