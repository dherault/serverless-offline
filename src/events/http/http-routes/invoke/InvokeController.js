import serverlessLog from '../../../../serverlessLog.js'
import { createUniqueId } from '../../../../utils/index.js'

export default class InvokeController {
  constructor(lambda) {
    this._lambda = lambda
  }

  async invoke(functionName, invocationType, event, clientContext) {
    const lambdaFunction = this._lambda.getByFunctionName(functionName)
    const requestId = createUniqueId()

    lambdaFunction.setClientContext(clientContext)
    lambdaFunction.setEvent(event)
    lambdaFunction.setRequestId(requestId)

    if (invocationType === 'Event') {
      // don't await result!
      /* result =  await */
      lambdaFunction
        .runHandler()
        .then(() => {
          const {
            billedExecutionTimeInMillis,
            executionTimeInMillis,
          } = lambdaFunction

          serverlessLog(
            `(λ: ${functionName}) RequestId: ${requestId}  Duration: ${executionTimeInMillis.toFixed(
              2,
            )} ms  Billed Duration: ${billedExecutionTimeInMillis} ms`,
          )
        })
        .catch((err) => {
          // TODO handle error
          console.log(err)
          throw err
        })

      return {
        Payload: '',
        StatusCode: 202,
      }
    }

    if (invocationType === 'RequestResponse') {
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
    }

    return undefined
  }
}
