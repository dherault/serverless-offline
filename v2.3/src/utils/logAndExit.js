'use strict';

const log = require('./log');

module.exports = function logAndExit() {
  console.log();
  log.apply(null, arguments);
  process.exit(0);
};
