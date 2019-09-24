'use strict'

const { stringify } = JSON

exports.hello = async function hello() {
  return {
    body: stringify({ hello: 'nodemon' }),
    statusCode: 200,
  }
}
