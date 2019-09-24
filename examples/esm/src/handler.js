const { stringify } = JSON

export async function hello() {
  return {
    body: stringify({ hello: 'esm' }),
    statusCode: 200,
  }
}
