const { stringify } = JSON

export async function user() {
  return {
    body: stringify({ status: "authorized" }),
    statusCode: 200,
  }
}

export async function context(event) {
  return {
    body: stringify({ authorizer: event.requestContext.authorizer }),
    statusCode: 200,
  }
}
