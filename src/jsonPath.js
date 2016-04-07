'use strict';

const JSONPath = require('jsonpath-plus');
const debugLog = require('./debugLog');

/*
  Just a wrapper around an external dependency for debugging purposes
*/
module.exports = function jsonPath(json, path) {
  
  debugLog('Calling JSONPath:', path);
  const result = JSONPath({ json, path, wrap: true })[0];
  debugLog('JSONPath resolved:', result);
  
  return result;
};
