'use strict';

process.on('uncaughtException', e => {
  process.send({ error: e });
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
  handler[opts.name](opts.event, context, done);
});