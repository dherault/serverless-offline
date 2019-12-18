import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda'

const { stringify } = JSON

export const serverlessWebpack: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = async function serverlessWebpack(event, context, callback) {
  return {
    body: stringify({ hello: 'docker and serverless-webpack!' }),
    statusCode: 200,
  }
}
