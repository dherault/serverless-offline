const { stringify } = JSON

export const handler = async () => {
  return {
    body: stringify({ hello: "serverless-yarn-pnp!" }),
    statusCode: 200,
  }
}
