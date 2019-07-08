'use strict';

const { createHash } = require('crypto');

const { isArray } = Array;

exports.createUniqueId = require('./createUniqueId.js');
exports.formatToClfTime = require('./formatToClfTime.js');
exports.parseMultiValueQueryStringParameters = require('./parseMultiValueQueryStringParameters.js');
exports.parseQueryStringParameters = require('./parseQueryStringParameters.js');
exports.satisfiesVersionRange = require('./satisfiesVersionRange.js');

exports.toPlainOrEmptyObject = function toPlainOrEmptyObject(obj) {
  return typeof obj === 'object' && !isArray(obj) ? obj : {};
};

exports.nullIfEmpty = function nullIfEmpty(o) {
  return o && (Object.keys(o).length > 0 ? o : null);
};

exports.isPlainObject = function isPlainObject(obj) {
  return typeof obj === 'object' && !isArray(obj) && obj != null;
};

exports.normalizeQuery = function normalizeQuery(query) {
  // foreach key, get the last element if it's an array
  return Object.keys(query).reduce((q, param) => {
    q[param] = [].concat(query[param]).pop();

    return q;
  }, {});
};

exports.normalizeMultiValueQuery = function normalizeMultiValueQuery(query) {
  // foreach key, ensure that the value is an array
  return Object.keys(query).reduce((q, param) => {
    q[param] = [].concat(query[param]);

    return q;
  }, {});
};

exports.capitalizeKeys = function capitalizeKeys(o) {
  const capitalized = {};
  for (const key in o) {
    capitalized[key.replace(/((?:^|-)[a-z])/g, (x) => x.toUpperCase())] =
      o[key];
  }

  return capitalized;
};

// Detect the toString encoding from the request headers content-type
// enhance if further content types need to be non utf8 encoded.
exports.detectEncoding = function detectEncoding(request) {
  return typeof request.headers['content-type'] === 'string' &&
    request.headers['content-type'].includes('multipart/form-data')
    ? 'binary'
    : 'utf8';
};

exports.createDefaultApiKey = function createDefaultApiKey() {
  return createHash('md5').digest('hex');
};
