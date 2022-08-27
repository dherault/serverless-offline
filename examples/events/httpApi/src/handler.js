const { stringify } = JSON

export async function hello() {
  return {
    body: stringify({
      foo: 'bar',
    }),
    statusCode: 200,
  }
}
