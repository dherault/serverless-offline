'use strict';

const isPlainObject = require('lodash.isplainobject');

module.exports = {
  toPlainOrEmptyObject: obj => isPlainObject(obj) && obj || {}
};
