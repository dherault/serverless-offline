import InvokeAsyncController from './InvokeAsyncController.js'
const { parse } = JSON
export default function invokeRoute(lambda, options) {
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
      cors: options.corsConfig,
      payload: {
        defaultContentType: 'binary/octet-stream',
        parse: false,
      },
      tags: ['api'],
    },
    path: '/2014-11-13/functions/{functionName}/invoke-async/',
  }
}
