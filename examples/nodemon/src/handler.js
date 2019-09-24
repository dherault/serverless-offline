'use strict'

const { stringify } = JSON

exports.hello = async function hello() {
  return {
    body: stringify({ hello: 'world' }),
    statusCode: 200,
  }
}
