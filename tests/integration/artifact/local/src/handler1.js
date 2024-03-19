const { stringify } = JSON

export async function hello() {
  return {
    body: stringify({
      message: "handler1: Hello Node.js!",
    }),
    statusCode: 200,
  }
}
