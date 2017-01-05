'use strict';

const jsonPathPlus = require('jsonpath-plus');
const debugLog = require('./debugLog');

/*
  Just a wrapper around an external dependency for debugging purposes
*/
module.exports = function jsonPath(json, path) {

  debugLog('Calling jsonPath:', path);
  const result = jsonPathPlus({ json, path, wrap: true })[0];
  debugLog('jsonPath resolved:', result);

  return result;
};
