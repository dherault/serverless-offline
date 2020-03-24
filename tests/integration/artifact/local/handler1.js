'use strict'

const { stringify } = JSON

exports.hello = async function hello() {
  return {
    body: stringify({
      message: 'handler1: Hello Node.js!',
    }),
    statusCode: 200,
  }
}
