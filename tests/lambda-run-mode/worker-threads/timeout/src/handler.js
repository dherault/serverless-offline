import { setTimeout } from "node:timers/promises"

const { stringify } = JSON

let counter = 0

export async function foo(event, context) {
  counter += 1

  await setTimeout(1000, "result")

  return {
    body: stringify({
      counter,
      remainingTime: context.getRemainingTimeInMillis(),
    }),
    statusCode: 200,
  }
}
