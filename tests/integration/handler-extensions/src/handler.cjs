'use strict'

const { stringify } = JSON

exports.handle = function handle(event, context) {
  context.done(null, {
    body: stringify('cjs'),
    statusCode: 200,
  })
}
