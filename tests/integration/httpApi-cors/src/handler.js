const { stringify } = JSON

export async function get() {
  return {
    body: stringify({
      something: true,
    }),
    statusCode: 200,
  }
}
