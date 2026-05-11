const { stringify } = JSON

export async function responseHeader(event, context) {
  return {
    body: stringify(
      {
        context,
        event,
      },
      null,
      2,
    ),
    headers: {
      "Content-Type": "text/plain",
      "Set-Cookie": "alb-cookie=works",
    },
    statusCode: 200,
  }
}
