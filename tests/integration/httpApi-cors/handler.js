'use strict'

exports.user = async function get() {
  return {
    body: JSON.stringify({
      something: true,
    }),
    statusCode: 200,
  }
}
