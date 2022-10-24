const { stringify } = JSON

export async function user() {
  return {
    body: stringify({ status: 'authorized' }),
    statusCode: 200,
  }
}
