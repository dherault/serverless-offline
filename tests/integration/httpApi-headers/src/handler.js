const { stringify } = JSON

export async function echoHeaders(event) {
  return {
    body: stringify({
      headersReceived: event.headers,
    }),
    statusCode: 200,
  }
}
