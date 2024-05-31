const { stringify } = JSON

const { foo } = await import("./foo.js")

// eslint-disable-next-line import/prefer-default-export
export async function bar() {
  return {
    body: stringify(foo),
    statusCode: 200,
  }
}
