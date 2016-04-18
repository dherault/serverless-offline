'use strict';

const isPlainObject = require('lodash.isplainobject');

const logDebug = require('../../utils/logDebug');
// const logAndExit = require('../../utils/logAndExit');
const createLambdaContext = require('./createLambdaContext');
const getState = require('../../state/store').getState;
const setEnvironment = require('../../state/actionCreators').setEnvironment;


module.exports = function loadAndCallHandlerForNodejs(fun, handlerPath, handlerName, event, callback, context) {
  
  const state = getState();
  
  if (state.options.skipCacheInvalidation) logDebug('Skipping cache invalidation.');
  else {
    logDebug('Invalidating cache...');
    
    for (let key in require.cache) {
      // Require cache invalidation, brutal and fragile. Might cause errors, if so please submit an issue.
      if (!key.match('node_modules')) delete require.cache[key];
    }
  }
  
  logDebug('Setting env vars...');
  
  // Clears old vars
  for (let key in state.environment) {
    delete process.env[key];
  }
  
  // Declares new ones
  const envVars = isPlainObject(fun.environment) ? fun.environment : {};
  setEnvironment(envVars);
  for (let key in envVars) {
    process.env[key] = envVars[key];
  }
  
  logDebug(`Loading handler... (${handlerPath}:${handlerName})`);
  
  let handler;
  try {
    handler = require(handlerPath)[handlerName];
  }
  catch(err) {
    err.offlineMessage = `Error while loading ${fun.name}`;
    throw err;
  }
  
  if (typeof handler !== 'function') throw new Error(`Fatal error: handler for '${fun.name}' is not a function. Handler path: '${handlerPath}. Handler name: '${handlerName}'.`);
  
  let result;
  
  try {
    result = handler(event, context || createLambdaContext(fun), callback);
  }
  catch(err) {
    err.offlineMessage = `Uncaught error in your '${fun.name}' handler`;
    throw err;
  }
  
  return result;
};
