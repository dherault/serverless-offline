'use strict';

/*
  Mimicks the lambda context object
  http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
*/
module.exports = function createLambdaContext(fun) {
  
  const functionName = fun.name;
  const endTime = Date.now() + (fun.timeout || 6) * 1000;
  
  return {
    /* Methods */
    getRemainingTimeInMillis: () => endTime - Date.now(),
    
    /* Properties */
    functionName,
    memoryLimitInMB: fun.memorySize,
    functionVersion: 'offline_functionVersion_for_' + functionName,
    invokedFunctionArn: 'offline_invokedFunctionArn_for_' + functionName,
    awsRequestId: 'offline_awsRequestId_' + Math.random().toString(10).slice(2),
    logGroupName: 'offline_logGroupName_for_' + functionName,
    logStreamName: 'offline_logStreamName_for_' + functionName,
    identity: {},
    clientContext: {},
  };
};
