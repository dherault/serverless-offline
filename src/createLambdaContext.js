'use strict';

/*

http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
*/
module.exports = function createLambdaContext(fun, cb) {
  
  const functionName = fun.name;
  const done = typeof cb === 'function' ? cb : ((x, y) => x || y);
  const succeed = result => done(null, result);
  const fail = error => done(error, null);
  
  return {
    /* Methods */
    done,
    succeed,
    fail,
    
    /* Properties */
    functionName,
    memoryLimitInMB: fun.memorySize,
    functionVersion: 'offline_functionVersion_for_' + functionName,
    invokedFunctionArn: 'offline_invokedFunctionArn_for_' + functionName,
    awsRequestId: 'offline_awsRequestId_' + Math.random().toString(10).slice(2),
    logGroupName: 'offline_logGroupName_for_' + functionName,
    logStreamName: 'offline_logStreamName_for_' + functionName,
    identity: null,
    clientContext: null,
  };
};
