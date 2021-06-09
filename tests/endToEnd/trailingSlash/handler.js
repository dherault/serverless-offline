'use strict'

exports.echo = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      path: event.path,
      resource: event.resource,
    }),
  }
}
