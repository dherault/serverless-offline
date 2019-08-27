'use strict'

const { stringify } = JSON

module.exports.hello = async () => {
  return {
    body: stringify({ foo: 'bar' }),
    statusCode: 200,
  }
}
