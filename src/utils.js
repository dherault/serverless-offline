'use strict';

const isPlainObject = require('lodash').isPlainObject;

module.exports = {
  toPlainOrEmptyObject: obj => isPlainObject(obj) && obj || {},
};
