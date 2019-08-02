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
      lambdaName,
      memorySize,
      timeout = DEFAULT_TIMEOUT,
    } = options;

    const endTime = new Date().getTime() + timeout * 1000;

    return {
      // doc-deprecated methods
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
