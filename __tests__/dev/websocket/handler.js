'use strict'

const { stringify } = JSON

exports.connect = async function connect() {
  return {
    body: stringify({ foo: 'bar' }),
    statusCode: 200,
  }
}

exports.disconnect = async function disconnect() {
  return {
    body: stringify({ foo: 'bar' }),
    statusCode: 200,
  }
}

exports.default = async function _default() {
  return {
    body: stringify({ foo: 'bar' }),
    statusCode: 200,
  }
}
