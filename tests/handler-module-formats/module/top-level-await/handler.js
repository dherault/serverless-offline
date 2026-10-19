const { stringify } = JSON

const { foo } = await import("./foo.js")

export async function bar() {
  return {
    body: stringify(foo),
    statusCode: 200,
  }
}
