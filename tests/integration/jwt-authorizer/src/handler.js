const { stringify } = JSON

export async function user(context) {
  return {
    body: stringify({
      requestContext: {
        claims: context.requestContext.authorizer.claims,
        scopes: context.requestContext.authorizer.scopes,
      },
      status: "authorized",
    }),
    statusCode: 200,
  }
}
