// class for creating a LambdaContext
// http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
export default class LambdaContext {
  constructor(config) {
    const { functionName, memorySize, requestId } = config

    this._callbackWaitsForEmptyEventLoop = true
    this._functionName = functionName
    this._memorySize = memorySize
    this._requestId = requestId
  }

  // returns a new Context instance
  create() {
    return {
      // properties
      awsRequestId: this._requestId,
      clientContext: undefined,
      get callbackWaitsForEmptyEventLoop() {
        return this._callbackWaitsForEmptyEventLoop
      },
      set callbackWaitsForEmptyEventLoop(value) {
        // NOTE: we can't emulate this yet
        // TODO we could log a warning?
        this._callbackWaitsForEmptyEventLoop = value
      },
      functionName: this._functionName,
      functionVersion: `$LATEST`,
      identity: undefined,
      invokedFunctionArn: `offline_invokedFunctionArn_for_${this._functionName}`,
      logGroupName: `offline_logGroupName_for_${this._functionName}`,
      logStreamName: `offline_logStreamName_for_${this._functionName}`,
      memoryLimitInMB: String(this._memorySize), // NOTE: string in AWS
    }
  }
}
