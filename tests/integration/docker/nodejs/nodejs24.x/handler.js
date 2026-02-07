"use strict"

// eslint-disable-next-line unicorn/prefer-node-protocol
const { versions } = require("process")

const { stringify } = JSON

module.exports.hello = async () => {
  return {
    body: stringify({
      message: "Hello Node.js 24.x!",
      version: versions.node,
    }),
    statusCode: 200,
  }
}
