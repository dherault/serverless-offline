const { stringify } = JSON

export async function hello() {
  return {
    body: stringify({ message: 'hello' }),
    statusCode: 200,
  }
}
