const { stringify } = JSON

export async function echoHeaders(event) {
  return {
    body: stringify({
      bodyReceived: event.body,
      headersReceived: event.headers,
      isBase64EncodedReceived: event.isBase64Encoded,
    }),
    statusCode: 200,
  }
}
