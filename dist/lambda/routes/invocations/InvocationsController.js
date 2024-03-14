import { log } from '@serverless/utils/log.js'
export default class InvocationsController {
  #lambda = null
  constructor(lambda) {
    this.#lambda = lambda
  }
  async invoke(functionName, invocationType, event, clientContext) {
    const functionNames = this.#lambda.listFunctionNames()
    if (functionNames.length === 0 || !functionNames.includes(functionName)) {
      log.error(
        `Attempt to invoke function '${functionName}' failed. Function does not exists.`,
      )
      return {
        FunctionError: 'ResourceNotFoundException',
        Payload: {
          Message: `Function not found: ${functionName}`,
          Type: 'User',
        },
        StatusCode: 404,
      }
    }
    const lambdaFunction = this.#lambda.getByFunctionName(functionName)
    lambdaFunction.setClientContext(clientContext)
    lambdaFunction.setEvent(event)
    if (invocationType === 'Event') {
      lambdaFunction.runHandler()
      return {
        Payload: '',
        StatusCode: 202,
      }
    }
    if (!invocationType || invocationType === 'RequestResponse') {
      let result
      try {
        result = await lambdaFunction.runHandler()
      } catch (err) {
        log.error(
          `Unhandled Lambda Error during invoke of '${functionName}': ${err}`,
        )
        return {
          Payload: {
            errorMessage: err.message,
            errorType: 'Error',
            trace: err.stack.split('\n'),
          },
          StatusCode: 200,
          UnhandledError: true,
        }
      }
      if (result) {
        if (typeof result === 'string') {
          result = `"${result}"`
        }
      }
      return {
        Payload: result,
        StatusCode: 200,
      }
    }
    const errMsg = `invocationType: '${invocationType}' not supported by serverless-offline`
    log.error(errMsg)
    return {
      FunctionError: 'InvalidParameterValueException',
      Payload: {
        Message: errMsg,
        Type: 'User',
      },
      StatusCode: 400,
    }
  }
}
