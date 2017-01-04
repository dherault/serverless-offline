'use strict';

/*
  Mimicks the lambda context object
  http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
*/
module.exports = function createLambdaContext(fun, cb) {

  const functionName = fun.name;
  const endTime = new Date().getTime() + (fun.timeout ? fun.timeout * 1000 : 6000);
  const done = typeof cb === 'function' ? cb : ((x, y) => x || y); // eslint-disable-line no-extra-parens
  
  Object.assign(process.env, {
    "LAMBDA_TASK_ROOT":                "/var/task",
    "LAMBDA_RUNTIME_DIR":              "/var/runtime",
    "AWS_LAMBDA_LOG_GROUP_NAME":       `/aws/lambda/${functionName}`,
    "AWS_LAMBDA_FUNCTION_NAME":        functionName,
    "AWS_LAMBDA_FUNCTION_MEMORY_SIZE": fun.memorySize,
    "AWS_LAMBDA_FUNCTION_VERSION":     "$LATEST"
  });

  return {
    /* Methods */
    done,
    succeed: res => done(null, res),
    fail:    err => done(err, null),
    getRemainingTimeInMillis: () => endTime - new Date().getTime(),

    /* Properties */
    functionName,
    memoryLimitInMB:    fun.memorySize,
    functionVersion:    `offline_functionVersion_for_${functionName}`,
    invokedFunctionArn: `offline_invokedFunctionArn_for_${functionName}`,
    awsRequestId:       `offline_awsRequestId_${Math.random().toString(10).slice(2)}`,
    logGroupName:       `offline_logGroupName_for_${functionName}`,
    logStreamName:      `offline_logStreamName_for_${functionName}`,
    identity:           {},
    clientContext:      {},
  };
};
