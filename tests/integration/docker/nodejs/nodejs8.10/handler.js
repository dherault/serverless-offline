'use strict'

const { versions } = require('process')

const { stringify } = JSON

exports.hello = async function hello() {
  return {
    body: stringify({
      message: 'Hello Node.js 8.10!',
      version: versions.node,
    }),
    statusCode: 200,
  }
}
