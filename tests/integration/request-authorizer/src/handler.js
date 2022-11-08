const { stringify } = JSON

export async function user() {
  return {
    body: stringify({ status: 'Authorized' }),
    statusCode: 200,
  }
}
