const { stringify } = JSON

export async function hello() {
  return {
    body: stringify({
      hello: "nodemon",
    }),
    statusCode: 200,
  }
}
