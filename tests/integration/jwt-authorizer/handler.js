'use strict'

const { stringify } = JSON

exports.user = async function get(context) {
  return {
    body: stringify({
      status: 'authorized',
      requestContext: {
        claims: context.requestContext.authorizer.claims,
        scopes: context.requestContext.authorizer.scopes,
      },
    }),
    statusCode: 200,
  }
}
