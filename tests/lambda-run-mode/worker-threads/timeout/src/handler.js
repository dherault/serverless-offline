import { promisify } from 'node:util'

const setTimeoutPromise = promisify(setTimeout)

const { stringify } = JSON

let counter = 0

export async function foo(event, context) {
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
