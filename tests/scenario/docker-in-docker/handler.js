'use strict'

const { stringify } = JSON

module.exports.hello = async () => {
  return {
    body: stringify({
      message: 'Hello Node.js 12.x!',
    }),
    statusCode: 200,
  }
}
