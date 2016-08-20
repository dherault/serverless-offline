'use strict';

// Use "sls offline start [your options] --debugOffline" for additionnal logs
module.exports = typeof process.env.SLS_DEBUG !== 'undefined' ? console.log.bind(null, '[offline]') : (() => null); // eslint-disable-line no-extra-parens
