'use strict';

// Use "sls offline start [your options] --debugOffline" for additionnal logs
module.exports = process.argv.indexOf('--debugOffline') !== -1 ? console.log.bind(null, '[debug]') : (() => null);
