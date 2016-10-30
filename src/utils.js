'use strict';

const _ = require('lodash');

module.exports = {
  toPlainOrEmptyObject: obj => _.isPlainObject(obj) ? obj : {},
  random: (lower, upper, floating) => _.random(lower, upper, floating),
  nullIfEmpty: o => o && (Object.keys(o).length > 0 ? o : null),
};
