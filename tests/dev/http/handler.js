'use strict'

const { stringify } = JSON

exports.hello = async function hello() {
  return {
    body: stringify({ foo: 'bar' }),
    statusCode: 200,
  }
}
