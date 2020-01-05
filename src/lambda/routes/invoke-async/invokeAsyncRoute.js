import InvokeAsyncController from './InvokeAsyncController.js'

const { parse } = JSON

// https://docs.aws.amazon.com/lambda/latest/dg/API_InvokeAsync.html
export default function invokeRoute(lambda) {
  const invokeAsyncController = new InvokeAsyncController(lambda)

  return {
    handler(request) {
      const {
        params: { functionName },
        payload,
      } = request

      const event = parse(payload.toString('utf-8'))

      return invokeAsyncController.invokeAsync(functionName, event)
    },
    method: 'POST',
    options: {
      payload: {
        // allow: ['binary/octet-stream'],
        defaultContentType: 'binary/octet-stream',
        // request.payload will be a raw buffer
        parse: false,
      },
      tags: ['api'],
    },
    path: '/{apiVersion}/functions/{functionName}/invoke-async/',
  }
}
