const { stringify } = JSON

export async function hello(event, context) {
  return {
    body: stringify(
      {
        context,
        event,
      },
      null,
      2,
    ),
    statusCode: 200,
  }
}
