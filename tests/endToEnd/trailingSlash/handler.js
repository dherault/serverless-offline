'use strict'

const { stringify } = JSON

exports.echo = async (event) => {
  return {
    statusCode: 200,
    body: stringify({
      path: event.path,
      resource: event.resource,
    }),
  }
}
