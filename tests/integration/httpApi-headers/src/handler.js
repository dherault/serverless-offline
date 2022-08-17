'use strict'

const { stringify } = JSON

exports.echoHeaders = async function echoHeaders(event) {
  return {
    body: stringify({
      headersReceived: event.headers,
    }),
    statusCode: 200,
  }
}
