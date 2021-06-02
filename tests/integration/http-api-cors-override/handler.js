'use strict'

// Does not set any CORS headers
exports.get = async function get(/* context */) {
  return {
    body: JSON.stringify({
      status: 'authorized',
    }),
    statusCode: 200,
  }
}

// Example of a manual Cors definition that
// explicitly returns a 404
exports.cors404 = async function cors404(/* context */) {
  return {
    statusCode: 404,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'content-length': '9',
    },
    isBase64Encoded: false,
    body: 'Not Found',
  }
}

// Example of a manual Cors definition that
// explicitly returns a 401
exports.cors401 = async function cors401(/* context */) {
  return {
    statusCode: 401,
    headers: {
      'x-sls-should-return-401': '401',
    },
    isBase64Encoded: false,
    body: 'Unauthorized',
  }
}
