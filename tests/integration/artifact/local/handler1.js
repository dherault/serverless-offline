'use strict'

exports.hello = async function hello() {
  return {
    body: JSON.stringify({
      message: 'handler1: Hello Node.js!',
    }),
    statusCode: 200,
  }
}
