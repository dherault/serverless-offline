'use strict'

const { stringify } = JSON

exports.user = async function get() {
  return {
    body: stringify({
      something: true,
    }),
    statusCode: 200,
  }
}
