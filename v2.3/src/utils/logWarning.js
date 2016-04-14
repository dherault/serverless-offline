'use strict';

const log = require('./log');
const chalk = require('chalk');

module.exports = log.bind(null, chalk.yellow('Warning'));
