const { stringify } = JSON

export async function user(event) {
  const { authorizer } = event.requestContext
  return {
    body: stringify({
      hasAuthorizer: !!authorizer,
      status: "Authorized",
    }),
    statusCode: 200,
  }
}
