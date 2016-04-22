'use strict';

const chalk = require('chalk');
const isDebug = require('./isDebug');

// Use "sls offline start [your options] --debugOffline" for additionnal logs
module.exports = isDebug ? 
  console.log.bind(null, chalk.bgYellow('Debug')) : 
  (() => undefined);
