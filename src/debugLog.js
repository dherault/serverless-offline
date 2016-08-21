'use strict';

module.exports = typeof process.env.SLS_DEBUG !== 'undefined' ? console.log.bind(null, '[offline]') : (() => null); // eslint-disable-line no-extra-parens
