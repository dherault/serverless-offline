import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

const { stringify } = JSON

export async function serverlessPluginTypescript(
  event: APIGatewayProxyEvent,
  context: APIGatewayProxyResult,
) {
  return {
    body: stringify({ hello: "serverless-plugin-typescript!" }),
    statusCode: 200,
  }
}
