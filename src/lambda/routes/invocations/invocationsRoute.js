import { Buffer } from "node:buffer"
import InvocationsController from "./InvocationsController.js"

const { parse } = JSON

// https://docs.aws.amazon.com/lambda/latest/dg/API_Invoke.html
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
      const clientContextHeader = parsedHeaders.get("x-amz-client-context")
      const invocationType = parsedHeaders.get("x-amz-invocation-type")

      // default is undefined
      let clientContext

      // check client context header was set
      if (clientContextHeader) {
        const clientContextBuffer = Buffer.from(clientContextHeader, "base64")
        clientContext = parse(clientContextBuffer.toString("utf8"))
      }

      // check if payload was set, if not, default event is an empty object
      const event = payload.length > 0 ? parse(payload.toString("utf8")) : {}

      const invokeResults = await invocationsController.invoke(
        functionName,
        invocationType,
        event,
        clientContext,
      )

      // Return with correct status codes
      let resultPayload = ""
      let statusCode = 200
      let functionError = null
      if (invokeResults) {
        const isPayloadDefined = invokeResults.Payload !== undefined
        resultPayload = isPayloadDefined ? invokeResults.Payload : ""
        statusCode = invokeResults.StatusCode || 200
        functionError = invokeResults.FunctionError || null
      }
      const response = h.response(resultPayload).code(statusCode)
      if (functionError) {
        // AWS Invoke documentation is wrong. The header for error type is
        // 'x-amzn-ErrorType' in production, not 'X-Amz-Function-Error'
        response.header("x-amzn-ErrorType", functionError)
      }
      if (invokeResults && invokeResults.UnhandledError) {
        response.header("X-Amz-Function-Error", "Unhandled")
      }
      return response
    },
    method: "POST",
    options: {
      cors: options.corsConfig,
      payload: {
        // allow: ['binary/octet-stream'],
        defaultContentType: "binary/octet-stream",
        // Set maximum size to 6 MB to match maximum invocation payload size in synchronous responses
        maxBytes: 1024 * 1024 * 6,
        // request.payload will be a raw buffer
        parse: false,
      },
      tags: ["api"],
    },
    path: "/2015-03-31/functions/{functionName}/invocations",
  }
}
