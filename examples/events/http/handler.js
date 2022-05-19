'use strict'

const { env } = require('node:process')

const { stringify } = JSON

exports.hello = async function hello() {
  return {
    body: stringify({ foo: 'bar', IS_OFFLINE: env.IS_OFFLINE }),
    statusCode: 200,
  }
}
