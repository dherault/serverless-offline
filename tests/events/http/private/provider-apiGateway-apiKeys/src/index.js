const { stringify } = JSON

export default async function handler() {
  return {
    body: stringify({
      foo: "bar",
    }),
    statusCode: 200,
  }
}
