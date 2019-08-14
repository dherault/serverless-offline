'use strict'

const EventEmitter = require('events')

// class for creating a LambdaContext
// http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
module.exports = class LambdaContext extends EventEmitter {
  constructor(config) {
    super()

    const {
      awsRequestId,
      getRemainingTimeInMillis,
      lambdaName,
      memorySize,
    } = config

    this._awsRequestId = awsRequestId
    this._getRemainingTimeInMillis = getRemainingTimeInMillis
    this._lambdaName = lambdaName
    this._memorySize = memorySize
  }

  _callback(err, data) {
    this.emit('contextCalled', err, data)
  }

  // returns a new Context instance
  create() {
    return {
      // doc-deprecated methods
      done: (err, data) => this._callback(err, data),
      fail: (err) => this._callback(err),
      succeed: (res) => this._callback(null, res),

      // functions
      // NOTE: the AWS context methods are OWN FUNCTIONS (NOT on the prototype!)
      getRemainingTimeInMillis: this._getRemainingTimeInMillis,

      // properties
      awsRequestId: this._awsRequestId,
      callbackWaitsForEmptyEventLoop: true,
      clientContext: {},
      functionName: this._lambdaName,
      functionVersion: `offline_functionVersion_for_${this._lambdaName}`,
      identity: {},
      invokedFunctionArn: `offline_invokedFunctionArn_for_${this._lambdaName}`,
      logGroupName: `offline_logGroupName_for_${this._lambdaName}`,
      logStreamName: `offline_logStreamName_for_${this._lambdaName}`,
      memoryLimitInMB: this._memorySize,
    }
  }
}
