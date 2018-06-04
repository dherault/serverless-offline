'use strict';

const _ = require('lodash');

module.exports = {
  toPlainOrEmptyObject: obj => _.isPlainObject(obj) ? obj : {},
  randomId: () => Math.random().toString(10).slice(2),
  nullIfEmpty: o => o && (Object.keys(o).length > 0 ? o : null),
  normalizeQuery: query =>
    // foreach key, get the last element if it's an array
    Object.keys(query).reduce((q, param) => {
      q[param] = [].concat(query[param]).pop();

      return q;
    }, {}),
  capitalizeKeys: o => {
    const capitalized = {};
    for (let key in o) { // eslint-disable-line prefer-const
      capitalized[key.replace(/((?:^|-)[a-z])/g, x => x.toUpperCase())] = o[key];
    }

    return capitalized;
  },
  // Detect the toString encoding from the request headers content-type
  // enhance if further content types need to be non utf8 encoded.
  detectEncoding: request => _.includes(request.headers['content-type'], 'multipart/form-data') ? 'binary' : 'utf8',
};
