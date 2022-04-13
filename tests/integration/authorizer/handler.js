'use strict'

const { stringify } = JSON

exports.user = async function get() {
  return {
    body: stringify({ status: 'authorized' }),
    statusCode: 200,
  }
}

exports.context = async function get(event) {
  return {
    body: stringify({ authorizer: event.requestContext.authorizer }),
    statusCode: 200,
  }
}
