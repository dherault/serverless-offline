'use strict'

const { stringify } = JSON

exports.hello = async function hello() {
  return {
    body: stringify({ foo: 'bar', IS_OFFLINE: process.env.IS_OFFLINE }),
    statusCode: 200,
  }
}
