const { stringify } = JSON

// eslint-disable-next-line import/prefer-default-export
export async function foo() {
  return {
    body: stringify("foo"),
    statusCode: 200,
  }
}
