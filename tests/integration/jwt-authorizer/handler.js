'use strict'

exports.user = async function get(context) {
  return {
    body: JSON.stringify({
      status: 'authorized',
      requestContext: {
        claims: context.requestContext.authorizer.claims,
        scopes: context.requestContext.authorizer.scopes,
      },
    }),
    statusCode: 200,
  }
}
