'use strict'

const { stringify } = JSON

module.exports.hello = async () => {
  return {
    body: stringify({
      message: 'Hello Node.js 10.x!',
    }),
    statusCode: 200,
  }
}
