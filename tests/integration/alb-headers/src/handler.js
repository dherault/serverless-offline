export async function responseHeader() {
  return {
    body: "Plain text",
    headers: {
      "Content-Type": "text/plain",
      "Set-Cookie": "alb-cookie=works",
    },
    statusCode: 200,
  }
}
