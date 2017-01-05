'use strict';

const _ = require('lodash');

module.exports = {
  toPlainOrEmptyObject: obj => _.isPlainObject(obj) ? obj : {},
  random: (lower, upper, floating) => _.random(lower, upper, floating),
  nullIfEmpty: o => o && (Object.keys(o).length > 0 ? o : null),
  capitalizeKeys: o => {
    const capitalized = {};
    for (let key in o) { // eslint-disable-line prefer-const
      capitalized[key.replace(/((?:^|-)[a-z])/g, x => x.toUpperCase())] = o[key];
    }

    return capitalized;
  },
};
