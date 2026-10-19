import { bar } from "testpackage"

const { stringify } = JSON

export async function foo() {
  return {
    body: stringify(bar()),
    statusCode: 200,
  }
}
