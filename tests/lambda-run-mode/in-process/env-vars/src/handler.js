import { env } from "node:process"

const { stringify } = JSON

export async function foo() {
  return {
    body: stringify({
      env,
    }),
    statusCode: 200,
  }
}
