const utils = require('./utils');

/*
  Mimicks the lambda context object
  http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
*/
module.exports = function createLambdaContext(fun, cb) {

  const functionName = fun.name;
  const endTime = new Date().getTime() + (fun.timeout ? fun.timeout * 1000 : 6000);
  const done = typeof cb === 'function' ? cb : ((x, y) => x || y); // eslint-disable-line no-extra-parens

  return {
    /* Methods */
    done,
    succeed: res => done(null, res, true),
    fail:    err => done(err, null, true),
    getRemainingTimeInMillis: () => endTime - new Date().getTime(),

    /* Properties */
    functionName,
    memoryLimitInMB:    fun.memorySize,
    functionVersion:    `offline_functionVersion_for_${functionName}`,
    invokedFunctionArn: `offline_invokedFunctionArn_for_${functionName}`,
    awsRequestId:       `offline_awsRequestId_${utils.randomId()}`,
    logGroupName:       `offline_logGroupName_for_${functionName}`,
    logStreamName:      `offline_logStreamName_for_${functionName}`,
    identity:           {},
    clientContext:      {},
  };
};
