import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

const { stringify } = JSON

export async function serverlessEsbuild(
  event: APIGatewayProxyEvent, // oxlint-disable-line no-unused-vars
  context: APIGatewayProxyResult, // oxlint-disable-line no-unused-vars
) {
  return {
    body: stringify({ hello: "serverless-esbuild!" }),
    statusCode: 200,
  }
}
