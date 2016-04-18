'use strict';

module.exports = function loadAndCallHandler(fun, handlerPath, handlerName, event, callback) {
  
  const eventJSON = JSON.stringify(event);
  
  // shim it somehow, with process.exec or something, don't forget to create context
  return null;
};
