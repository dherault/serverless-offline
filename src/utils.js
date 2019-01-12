module.exports = {
  toPlainOrEmptyObject: obj => typeof obj === 'object' && !Array.isArray(obj) ? obj : {},
  randomId: () => Math.random().toString(10).slice(2),
  nullIfEmpty: o => o && (Object.keys(o).length > 0 ? o : null),
  isPlainObject: obj => typeof obj === 'object' && !Array.isArray(obj),
  normalizeQuery: query =>
    // foreach key, get the last element if it's an array
    Object.keys(query).reduce((q, param) => {
      q[param] = [].concat(query[param]).pop();

      return q;
    }, {}),
  normalizeMultiValueQuery: query =>
    // foreach key, ensure that the value is an array
    Object.keys(query).reduce((q, param) => {
      q[param] = [].concat(query[param]);

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
  detectEncoding: request => typeof request.headers['content-type'] === 'string' && request.headers['content-type'].includes('multipart/form-data') ? 'binary' : 'utf8',
};
