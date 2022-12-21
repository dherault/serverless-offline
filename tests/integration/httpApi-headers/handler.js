'use strict'

exports.echoHeaders = async function get(event) {
  return {
    body: JSON.stringify({
      headersReceived: event.headers,
    }),
    statusCode: 200,
  }
}
