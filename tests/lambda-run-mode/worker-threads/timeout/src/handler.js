'use strict'

const { promisify } = require('node:util')

const setTimeoutPromise = promisify(setTimeout)

const { stringify } = JSON

let counter = 0

exports.foo = async function foo(event, context) {
  counter += 1

  await setTimeoutPromise(1000, 'result')

  return {
    body: stringify({
      counter,
      remainingTime: context.getRemainingTimeInMillis(),
    }),
    statusCode: 200,
  }
}
