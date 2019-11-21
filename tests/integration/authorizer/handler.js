'use strict'

const { stringify } = JSON

exports.user = async function get() {
  return {
    body: stringify({ status: 'authorized' }),
    statusCode: 200,
  }
}
