const { stringify } = JSON

export const hello = async () => {
  return {
    body: stringify({
      foo: "bar",
    }),
    statusCode: 200,
  }
}
