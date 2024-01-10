"use strict"

const { stringify } = JSON

exports.foo = async function foo() {
  return {
    body: stringify("foo"),
    statusCode: 200,
  }
}
