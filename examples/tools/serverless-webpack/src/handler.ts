import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda"

const { stringify } = JSON

export const hello: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> =
  async function hello() {
    return {
      body: stringify({
        hello: "serverless-webpack",
      }),
      statusCode: 200,
    }
  }
