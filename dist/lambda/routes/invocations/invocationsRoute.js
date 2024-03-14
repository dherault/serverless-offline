import { Buffer } from 'node:buffer'
import InvocationsController from './InvocationsController.js'
const { parse } = JSON
export default function invocationsRoute(lambda, options) {
  const invocationsController = new InvocationsController(lambda)
  return {
    async handler(request, h) {
      const {
        headers,
        params: { functionName },
        payload,
      } = request
      const parsedHeaders = new Headers(headers)
      const clientContextHeader = parsedHeaders.get('x-amz-client-context')
      const invocationType = parsedHeaders.get('x-amz-invocation-type')
      let clientContext
      if (clientContextHeader) {
        const clientContextBuffer = Buffer.from(clientContextHeader, 'base64')
        clientContext = parse(clientContextBuffer.toString('utf-8'))
      }
      const event = payload.length > 0 ? parse(payload.toString('utf-8')) : {}
      const invokeResults = await invocationsController.invoke(
        functionName,
        invocationType,
        event,
        clientContext,
      )
      let resultPayload = ''
      let statusCode = 200
      let functionError = null
      if (invokeResults) {
        const isPayloadDefined = typeof invokeResults.Payload !== 'undefined'
        resultPayload = isPayloadDefined ? invokeResults.Payload : ''
        statusCode = invokeResults.StatusCode || 200
        functionError = invokeResults.FunctionError || null
      }
      const response = h.response(resultPayload).code(statusCode)
      if (functionError) {
        response.header('x-amzn-ErrorType', functionError)
      }
      if (invokeResults && invokeResults.UnhandledError) {
        response.header('X-Amz-Function-Error', 'Unhandled')
      }
      return response
    },
    method: 'POST',
    options: {
      cors: options.corsConfig,
      payload: {
        defaultContentType: 'binary/octet-stream',
        maxBytes: 1024 * 1024 * 6,
        parse: false,
      },
      tags: ['api'],
    },
    path: '/2015-03-31/functions/{functionName}/invocations',
  }
}
