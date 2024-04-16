const { stringify } = JSON

export async function echoHeaders(event) {
  return {
    body: stringify({
      body: event.body,
      headersReceived: event.headers,
      isBase64Encoded: event.isBase64Encoded,
    }),
    statusCode: 200,
  }
}
