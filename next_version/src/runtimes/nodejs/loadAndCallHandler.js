'use strict';

const createLambdaContext = require('./createLambdaContext');
const loadAndCallHandlerForNodejs = require('../node4.3/loadAndCallHandler');

module.exports = function loadAndCallHandlerForNodejs010(fun, handlerPath, handlerName, event, callback) {
  
  // No callback and a special context for this guy!
  return loadAndCallHandlerForNodejs(fun, handlerPath, handlerName, event, undefined, createLambdaContext(fun));
};
