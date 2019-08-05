'use strict';

const EventEmitter = require('events');

// class for creating a LambdaContext
// http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
module.exports = class LambdaContext extends EventEmitter {
  constructor(config) {
    super();

    this._config = config;
  }

  _callback(err, data) {
    this.emit('contextCalled', err, data);
  }

  // returns a new Context instance
  getContext() {
    const {
      awsRequestId,
      getRemainingTimeInMillis,
      lambdaName,
      memorySize,
    } = this._config;

    return {
      // doc-deprecated methods
      done: (err, data) => this._callback(err, data),
      fail: (err) => this._callback(err),
      succeed: (res) => this._callback(null, res),

      // functions
      // NOTE: the AWS context methods are OWN FUNCTIONS (NOT on the prototype!)
      getRemainingTimeInMillis,

      // properties
      awsRequestId,
      clientContext: {},
      functionName: lambdaName,
      functionVersion: `offline_functionVersion_for_${lambdaName}`,
      identity: {},
      invokedFunctionArn: `offline_invokedFunctionArn_for_${lambdaName}`,
      logGroupName: `offline_logGroupName_for_${lambdaName}`,
      logStreamName: `offline_logStreamName_for_${lambdaName}`,
      memoryLimitInMB: memorySize,
    };
  }
};
