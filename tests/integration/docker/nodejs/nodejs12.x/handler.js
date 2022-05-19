'use strict'

const { versions } = require('process')

const { stringify } = JSON

module.exports.hello = async () => {
  return {
    body: stringify({
      message: 'Hello Node.js 12.x!',
      version: versions.node,
    }),
    statusCode: 200,
  }
}
