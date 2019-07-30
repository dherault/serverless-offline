'use strict';

process.on('uncaughtException', (e) => {
  process.send({
    // process.send() can't serialize an Error object, so we help it out a bit
    error: {
      constructor: { name: e.constructor.name },
      ipcException: true,
      message: e.message,
      stack: e.stack,
    },
  });
});

// eslint-disable-next-line import/no-dynamic-require
const fun = require(process.argv[2]);

process.on('message', (opts) => {
  const {
    context: optsContext,
    event,
    funName: functionName,
    funTimeout,
    handlerName,
    id,
    memorySize,
  } = opts;

  function callback(error, data) {
    process.send({
      error,
      id,
      ret: data,
    });
  }

  const handler = fun[handlerName];

  if (typeof handler !== 'function') {
    throw new Error(
      `Serverless-offline: handler for '${handlerName}' is not a function`,
    );
  }

  const endTime =
    new Date().getTime() + (funTimeout ? funTimeout * 1000 : 6000);

  const context = {
    ...optsContext,

    done: callback,
    fail: (err) => callback(err, null),
    succeed: (res) => callback(null, res),

    getRemainingTimeInMillis() {
      return endTime - new Date().getTime();
    },

    awsRequestId: `offline_awsRequestId_${id}`,
    clientContext: {},
    functionName,
    functionVersion: `offline_functionVersion_for_${functionName}`,
    identity: {},
    invokedFunctionArn: `offline_invokedFunctionArn_for_${functionName}`,
    logGroupName: `offline_logGroupName_for_${functionName}`,
    logStreamName: `offline_logStreamName_for_${functionName}`,
    memoryLimitInMB: memorySize,
  };

  const x = handler(event, context, callback);

  if (x && typeof x.then === 'function') {
    x.then(context.succeed).catch(context.fail);
  } else if (x instanceof Error) {
    context.fail(x);
  }
});
