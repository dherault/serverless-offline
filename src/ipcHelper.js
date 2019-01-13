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

const handler = require(process.argv[2]);

process.on('message', opts => {
  function done(error, ret) {
    process.send({ id: opts.id, error, ret });
  }

  const context = Object.assign(opts.context, {
    done,
    succeed: res => done(null, res),
    fail:    err => done(err, null),
    // TODO implement getRemainingTimeInMillis
  });
  const x = handler[opts.name](opts.event, context, done);
  if (x && typeof x.then === 'function' && typeof x.catch === 'function') x.then(context.succeed).catch(context.fail);
  else if (x instanceof Error) context.fail(x);
});
