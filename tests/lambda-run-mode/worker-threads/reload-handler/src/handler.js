const { stringify } = JSON

let counter = 0

export async function foo() {
  counter += 1

  return {
    body: stringify(counter),
    statusCode: 200,
  }
}
