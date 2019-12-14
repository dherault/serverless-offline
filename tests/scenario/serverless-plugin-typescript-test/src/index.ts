import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda'

const { stringify } = JSON

export const serverlessPluginTypescript: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = async function serverlessWebpack(event, context, callback) {
  return {
    body: stringify({ hello: 'serverless-plugin-typescript!' }),
    statusCode: 200,
  }
}
