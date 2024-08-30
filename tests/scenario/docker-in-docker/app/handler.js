"use strict"

const { stringify } = JSON

module.exports.hello = async function hello() {
  return {
    body: stringify({
      message: "Hello Node.js 12.x!",
    }),
    statusCode: 200,
  }
}
