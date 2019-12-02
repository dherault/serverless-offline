import Lambda from '../../../lambda/index'
import { ClientContext } from '../../../types'

export type InvocationType = 'Event' | 'RequestResponse'

export default class InvokeController {
  private readonly _lambda: Lambda

  constructor(lambda: Lambda) {
    this._lambda = lambda
  }

  async invoke(
    functionName: string,
    invocationType: InvocationType,
    event,
    clientContext: ClientContext,
  ) {
    const lambdaFunction = this._lambda.getByFunctionName(functionName)

    lambdaFunction.setClientContext(clientContext)
    lambdaFunction.setEvent(event)

    if (invocationType === 'Event') {
      // don't await result!
      lambdaFunction.runHandler().catch((err) => {
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
      } catch (err) {
        // TODO handle error
        console.log(err)
        throw err
      }

      return result
    }

    // TODO FIXME
    console.log(
      `invocationType: '${invocationType}' not supported by serverless-offline`,
    )

    return undefined
  }
}
