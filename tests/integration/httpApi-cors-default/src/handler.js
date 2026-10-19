const { stringify } = JSON

export async function user() {
  return {
    body: stringify({
      something: true,
    }),
    statusCode: 200,
  }
}
