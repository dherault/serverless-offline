export default class InvokeController {
  constructor(lambda) {
    this._lambda = lambda
  }

  async invoke(functionName, invocationType, event, clientContext) {
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
