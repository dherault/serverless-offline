'use strict'

exports.handler = async (event) => {
  const { body, queryStringParameters, requestContext } = event
  const statusCode =
    queryStringParameters && queryStringParameters.statusCode
      ? Number(queryStringParameters.statusCode)
      : 200

  if (
    requestContext &&
    (!requestContext.identity || !requestContext.authorizer)
  ) {
    throw new Error('Missing authorizer data')
  }
  if (
    queryStringParameters &&
    queryStringParameters.throwError &&
    requestContext &&
    requestContext.routeKey === '$connect'
  ) {
    throw new Error('Throwing error during connect phase')
  }

  if (
    body &&
    JSON.parse(body).throwError &&
    requestContext &&
    requestContext.routeKey === '$default'
  ) {
    throw new Error('Throwing error from incoming message')
  }

  return {
    body: body || undefined,
    statusCode,
  }
}
