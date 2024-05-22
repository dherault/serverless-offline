// class for creating a LambdaContext
// http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html

export default class LambdaContext {
  #context = null

  constructor(functionName, memorySize) {
    this.#context = {
      awsRequestId: undefined,
      callbackWaitsForEmptyEventLoop: true,
      clientContext: undefined,
      functionName,
      functionVersion: "$LATEST",
      identity: undefined,
      invokedFunctionArn: `offline_invokedFunctionArn_for_${functionName}`,
      logGroupName: `offline_logGroupName_for_${functionName}`,
      logStreamName: `offline_logStreamName_for_${functionName}`,
      memoryLimitInMB: String(memorySize), // NOTE: string in AWS
    }
  }

  setClientContext(clientContext) {
    this.#context.clientContext = clientContext
  }

  setRequestId(requestId) {
    this.#context.awsRequestId = requestId
  }

  create() {
    return this.#context
  }
}
