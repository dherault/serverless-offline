import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

const { stringify } = JSON

export async function serverlessWebpack(
  event: APIGatewayProxyEvent, // oxlint-disable-line no-unused-vars
  context: APIGatewayProxyResult, // oxlint-disable-line no-unused-vars
) {
  return {
    body: stringify({ hello: "serverless-webpack!" }),
    statusCode: 200,
  }
}
