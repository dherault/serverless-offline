'use strict';

const loadAndCallHandlerForNodejs = require('../node4.3/loadAndCallHandler');

module.exports = function loadAndCallHandlerForBabel(fun, handlerPath, handlerName, event, callback) {
  
  const result = loadAndCallHandlerForNodejs(fun, handlerPath, handlerName, event, callback);
  
  if (result && typeof result.then === 'function' && typeof result.catch === 'function') result
    .then(x => callback(null, x))
    .catch(x => callback(x, null));
  else if (result instanceof Error) callback(result, null);
  else callback(null, result);
  
  return result; // useless but foo bar
};
