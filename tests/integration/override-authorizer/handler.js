'use strict'

const { stringify } = JSON

exports.echo_authorizer = async function get(context) {
  return {
    body: stringify(context.requestContext.authorizer),
    statusCode: 200,
  }
}
