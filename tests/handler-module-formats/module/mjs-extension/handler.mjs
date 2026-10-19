const { stringify } = JSON

export async function foo() {
  return {
    body: stringify("foo"),
    statusCode: 200,
  }
}
