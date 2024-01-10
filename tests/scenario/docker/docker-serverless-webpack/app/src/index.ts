import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

const { stringify } = JSON

export async function serverlessWebpack(
  event: APIGatewayProxyEvent,
  context: APIGatewayProxyResult,
) {
  return {
    body: stringify({ hello: "docker and serverless-webpack!" }),
    statusCode: 200,
  }
}
