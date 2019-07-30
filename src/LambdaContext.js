'use strict';

const { createUniqueId } = require('./utils/index.js');

// https://docs.aws.amazon.com/lambda/latest/dg/limits.html
// default function timeout in seconds
const DEFAULT_TIMEOUT = 900; // 15 min

// Mimicks the lambda context object
// http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
module.exports = class LambdaContext {
  constructor(options) {
    const {
      callback,
      functionName,
      memorySize,
      timeout = DEFAULT_TIMEOUT,
    } = options;

    const endTime = new Date().getTime() + timeout * 1000;

    // doc-deprecated methods
    return {
      done: callback,
      fail: (err) => callback(err, null),
      succeed: (res) => callback(null, res),

      // methods
      // NOTE: the AWS context methods are OWN FUNCTIONS (NOT on the prototype!)
      getRemainingTimeInMillis() {
        return endTime - new Date().getTime();
      },

      // properties
      awsRequestId: `offline_awsRequestId_${createUniqueId()}`,
      clientContext: {},
      functionName,
      functionVersion: `offline_functionVersion_for_${functionName}`,
      identity: {},
      invokedFunctionArn: `offline_invokedFunctionArn_for_${functionName}`,
      logGroupName: `offline_logGroupName_for_${functionName}`,
      logStreamName: `offline_logStreamName_for_${functionName}`,
      memoryLimitInMB: memorySize,
    };
  }
};
