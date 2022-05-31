'use strict'

const { stringify } = JSON

// eslint-disable-next-line import/prefer-default-export
export function handle(event, context) {
  context.done(null, {
    body: stringify('js'),
    statusCode: 200,
  })
}
