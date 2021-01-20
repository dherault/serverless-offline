'use strict'

exports.hello = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      foo: 'bar',
    }),
  }
}
