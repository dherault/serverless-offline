'use strict'

exports.echo_authorizer = async function get(context) {
  return {
    body: JSON.stringify(context.requestContext.authorizer),
    statusCode: 200,
  }
}
