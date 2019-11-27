import { Buffer } from 'buffer'
import { Headers } from 'node-fetch'
import InvokeController from './InvokeController.js'

const { parse } = JSON

// https://docs.aws.amazon.com/lambda/latest/dg/API_Invoke.html
export default function invokeRoute(lambda) {
  const invokeController = new InvokeController(lambda)

  return {
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
    path: '/{apiVersion}/functions/{functionName}/invocations',
    handler(request) {
      const {
        headers,
        params: { functionName },
        payload,
      } = request

      const _headers = new Headers(headers)

      const clientContextHeader = _headers.get('x-amz-client-context')
      const invocationType = _headers.get('x-amz-invocation-type')

      // default is undefined
      let clientContext

      // check client context header was set
      if (clientContextHeader) {
        const clientContextBuffer = Buffer.from(clientContextHeader, 'base64')
        clientContext = parse(clientContextBuffer.toString('utf-8'))
      }

      // check if payload was set, if not, default event is an empty object
      const event = payload.length > 0 ? parse(payload.toString('utf-8')) : {}

      return invokeController.invoke(
        functionName,
        invocationType,
        event,
        clientContext,
      )
    },
  }
}
