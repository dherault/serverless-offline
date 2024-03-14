export default class InvokeAsyncController {
  #lambda = null
  constructor(lambda) {
    this.#lambda = lambda
  }
  async invokeAsync(functionName, event) {
    const lambdaFunction = this.#lambda.getByFunctionName(functionName)
    lambdaFunction.setEvent(event)
    lambdaFunction.runHandler()
    return {
      StatusCode: 202,
    }
  }
}
