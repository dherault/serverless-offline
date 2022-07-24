'use strict'

const { stringify } = JSON

exports.user = async function user() {
  return {
    body: stringify({
      status: 'authorized',
    }),
    statusCode: 200,
  }
}

exports.authorizer = async function authorizer(event) {
  let response = {
    isAuthorized: false,
  }

  // type request || type token
  const token = event.headers
    ? event.headers.authorization
    : event.authorizationToken
  if (token === 'validToken') {
    response = {
      isAuthorized: true,
    }
  }

  return response
}
