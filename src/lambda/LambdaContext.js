// class for creating a LambdaContext
// http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
export default class LambdaContext {
  constructor(functionName, memorySize) {
    this._functionName = functionName
    this._memorySize = memorySize
  }

  // returns a new Context instance
  create(requestId) {
    return {
      awsRequestId: requestId,
      callbackWaitsForEmptyEventLoop: true,
      clientContext: undefined,
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
