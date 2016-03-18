'use strict';

const JSONPath = require('jsonpath-plus');
const debugLog = require('./debugLog');

module.exports = function jsonPath(json, path) {
  
  debugLog('Calling JSONPath:', path);
  const result = JSONPath({ json, path, wrap: false });
  debugLog('JSONPath resolved:', result);
  
  return result;
};
