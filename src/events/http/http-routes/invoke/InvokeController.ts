import serverlessLog from '../../../../serverlessLog'
import { createUniqueId } from '../../../../utils/index'

export default class InvokeController {
  private readonly _lambda: any

  constructor(lambda) {
    this._lambda = lambda
  }

  async invoke(functionName: string, event) {
    const lambdaFunction = this._lambda.getByFunctionName(functionName)

    const requestId = createUniqueId()

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
