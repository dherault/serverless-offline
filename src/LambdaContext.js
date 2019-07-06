'use strict';

const { createUniqueId } = require('./utils/index.js');

// https://docs.aws.amazon.com/lambda/latest/dg/limits.html
// default function timeout in seconds
const DEFAULT_TIMEOUT = 900; // 15 min

// Mimicks the lambda context object
// http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
module.exports = class LambdaContext {
  constructor(fun, provider, cb) {
    const functionName = fun.name;
    const timeout = (fun.timeout || provider.timeout || DEFAULT_TIMEOUT) * 1000;
    const endTime = new Date().getTime() + timeout;

    // doc-deprecated methods
    this.done = cb;
    this.fail = (err) => cb(err, null, true);
    this.succeed = (res) => cb(null, res, true);

    // methods
    // NOTE: the AWS context methods are OWN FUNCTIONS (NOT on the prototype!)
    this.getRemainingTimeInMillis = () => endTime - new Date().getTime();

    // properties
    this.awsRequestId = `offline_awsRequestId_${createUniqueId()}`;
    this.clientContext = {};
    this.functionName = functionName;
    this.functionVersion = `offline_functionVersion_for_${functionName}`;
    this.identity = {};
    this.invokedFunctionArn = `offline_invokedFunctionArn_for_${functionName}`;
    this.logGroupName = `offline_logGroupName_for_${functionName}`;
    this.logStreamName = `offline_logStreamName_for_${functionName}`;
    this.memoryLimitInMB = fun.memorySize || provider.memorySize;
  }
};
