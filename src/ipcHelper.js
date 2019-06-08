'use strict';

process.on('uncaughtException', e => {
  process.send({
    // process.send() can't serialize an Error object, so we help it out a bit
    error: {
      ipcException: true,
      message: e.message,
      constructor: { name: e.constructor.name },
      stack: e.stack,
    },
  });
});

const fun = require(process.argv[2]);

process.on('message', opts => {
  function done(error, ret) {
    process.send({ id: opts.id, error, ret });
  }

  const handler = fun[opts.handlerName];
  if (typeof handler !== 'function') {
    throw new Error(`Serverless-offline: handler for '${opts.handlerName}' is not a function`);
  }
  const endTime = new Date().getTime() + (opts.funTimeout ? opts.funTimeout * 1000 : 6000);

  const functionName = opts.funName;
  const context = Object.assign(opts.context, {
    done,
    succeed: res => done(null, res),
    fail:    err => done(err, null),
    getRemainingTimeInMillis: () => endTime - new Date().getTime(),

    /* Properties */
    functionName,
    memoryLimitInMB:    opts.memorySize,
    functionVersion:    `offline_functionVersion_for_${functionName}`,
    invokedFunctionArn: `offline_invokedFunctionArn_for_${functionName}`,
    awsRequestId:       `offline_awsRequestId_${opts.id}`,
    logGroupName:       `offline_logGroupName_for_${functionName}`,
    logStreamName:      `offline_logStreamName_for_${functionName}`,
    identity:           {},
    clientContext:      {},
  });
  const x = handler(opts.event, context, done);
  if (x && typeof x.then === 'function') x.then(context.succeed).catch(context.fail);
  else if (x instanceof Error) context.fail(x);
});
