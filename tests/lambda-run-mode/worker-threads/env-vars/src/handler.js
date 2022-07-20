'use strict'

const { env } = require('process')

const { stringify } = JSON

exports.foo = async function foo() {
  return {
    body: stringify({
      env,
    }),
    statusCode: 200,
  }
}
