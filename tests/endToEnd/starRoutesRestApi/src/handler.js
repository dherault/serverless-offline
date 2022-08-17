'use strict'

const { stringify } = JSON

exports.hello = async (event) => {
  return {
    body: stringify({
      path: event.path,
      resource: event.resource,
    }),
    statusCode: 200,
  }
}
