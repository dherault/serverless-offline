import serverlessLog from '../../serverlessLog.js'
import { createUniqueId } from '../../utils/index.js'

const { parse } = JSON

// https://docs.aws.amazon.com/lambda/latest/dg/API_Invoke.html
export default function invoke(provider, config, options, lambda) {
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
    async handler(request) {
      const {
        params: { functionName },
        payload,
      } = request

      const lambdaFunction = lambda.get(functionName)

      const requestId = createUniqueId()
      const stringPayload = payload.toString('utf-8')
      const event = parse(stringPayload)

      lambdaFunction.setEvent(event)
      lambdaFunction.setRequestId(requestId)

      let result

      try {
        result = await lambdaFunction.runHandler()

        const {
          billedExecutionTimeInMillis,
          executionTimeInMillis,
        } = lambdaFunction

        serverlessLog(
          `(λ: ${functionName}) RequestId: ${requestId}  Duration: ${executionTimeInMillis.toFixed(
            2,
          )} ms  Billed Duration: ${billedExecutionTimeInMillis} ms`,
        )
      } catch (err) {
        // TODO handle error
        console.log(err)
        throw err
      }

      return result
    },
  }
}
