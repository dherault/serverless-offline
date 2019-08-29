'use strict'

// class for creating a LambdaContext
// http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
module.exports = class LambdaContext {
  constructor(config) {
    const { requestId, lambdaName, memorySize } = config

    this._callbackWaitsForEmptyEventLoop = true
    this._lambdaName = lambdaName
    this._memorySize = memorySize
    this._requestId = requestId
  }

  // returns a new Context instance
  create() {
    return {
      // properties
      awsRequestId: this._requestId,
      clientContext: {},
      get callbackWaitsForEmptyEventLoop() {
        return this._callbackWaitsForEmptyEventLoop
      },
      set callbackWaitsForEmptyEventLoop(value) {
        // NOTE: we can't emulate this yet
        // TODO we could log a warning?
        this._callbackWaitsForEmptyEventLoop = value
      },
      functionName: this._lambdaName,
      functionVersion: `$LATEST`,
      identity: {},
      invokedFunctionArn: `offline_invokedFunctionArn_for_${this._lambdaName}`,
      logGroupName: `offline_logGroupName_for_${this._lambdaName}`,
      logStreamName: `offline_logStreamName_for_${this._lambdaName}`,
      memoryLimitInMB: String(this._memorySize), // NOTE: string in AWS
    }
  }
}
