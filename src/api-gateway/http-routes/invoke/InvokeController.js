import serverlessLog from '../../../serverlessLog.js'
import { createUniqueId } from '../../../utils/index.js'

const { parse } = JSON

export default class InvokeController {
  constructor(lambda) {
    this._lambda = lambda
  }

  async invoke(functionName, payload) {
    const lambdaFunction = this._lambda.get(functionName)

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
  }
}
