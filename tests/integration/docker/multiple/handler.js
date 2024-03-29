"use strict"

// eslint-disable-next-line unicorn/prefer-node-protocol
const { versions } = require("process")

const { stringify } = JSON

exports.hello = async function hello() {
  return {
    body: stringify({
      message: "Hello Node.js!",
      version: versions.node,
    }),
    statusCode: 200,
  }
}
