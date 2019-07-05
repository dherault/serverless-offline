'use strict';

const { createHash } = require('crypto');
const { DateTime } = require('luxon');
const cuid = require('cuid');

const { isArray } = Array;

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

exports.createUniqueId = function createUniqueId() {
  return cuid();
};

// CLF -> Common Log Format
// https://httpd.apache.org/docs/1.3/logs.html#common
// [day/month/year:hour:minute:second zone]
// day = 2*digit
// month = 3*letter
// year = 4*digit
// hour = 2*digit
// minute = 2*digit
// second = 2*digit
// zone = (`+' | `-') 4*digit
exports.formatToClfTime = function formatToClfTime(date) {
  return DateTime.fromJSDate(date).toFormat('dd/MMM/yyyy:HH:mm:ss ZZZ');
};
