'use strict'

exports.handler = async (event) => {
  const { body, requestContext } = event

  if (
    body &&
    JSON.parse(body).throwError &&
    requestContext &&
    requestContext.routeKey === '$default'
  ) {
    throw new Error('Throwing error from incoming message')
  }

  return {
    statusCode: 200,
    body: body || undefined,
  }
}
