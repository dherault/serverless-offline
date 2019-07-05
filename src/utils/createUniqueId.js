'use strict';

const cuid = require('cuid');

module.exports = function createUniqueId() {
  return cuid();
};
