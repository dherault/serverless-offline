'use strict';

const EventEmitter = require('events');
const { createUniqueId } = require('./utils/index.js');

// class for creating a LambdaContext
// http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
module.exports = class LambdaContext extends EventEmitter {
  constructor(options) {
    super();

    this._options = options;
  }

  _callback(err, data) {
    this.emit('contextCalled', err, data);
  }

  // returns a new Context instance
  getContext() {
    const { getRemainingTimeInMillis, lambdaName, memorySize } = this._options;

    return {
      // doc-deprecated methods
      done: (err, data) => this._callback(err, data),
      fail: (err) => this._callback(err, null),
      succeed: (res) => this._callback(null, res),

      // functions
      // NOTE: the AWS context methods are OWN FUNCTIONS (NOT on the prototype!)
      getRemainingTimeInMillis,

      // properties
      awsRequestId: `offline_awsRequestId_${createUniqueId()}`,
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
