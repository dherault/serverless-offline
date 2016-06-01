'use strict';

const debugLog = require('./debugLog');

module.exports = {
  getFunctionOptions(fun, populatedFun) {

    // Split handler into method name and path i.e. handler.run
    const handlerParts = fun.handler.split('/').pop().split('.');
    return {
      funName: fun.name,
      handlerName: handlerParts[1], // i.e. run
      handlerPath: fun.getRootPath(handlerParts[0]), // i.e. /Users/xx/xx/handler
      funTimeout: (populatedFun.timeout || 6) * 1000,
      babelOptions: ((populatedFun.custom || {}).runtime || {}).babel,
    };
  },

  // Create a function handler
  // The function handler is used to simulate Lambda functions
  createHandler(funOptions, options) {

    if (!options.skipCacheInvalidation) {
      debugLog('Invalidating cache...');

      for (const key in require.cache) {
        // Require cache invalidation, brutal and fragile.
        // Might cause errors, if so please submit an issue.
        if (!key.match('node_modules')) delete require.cache[key];
      }
    }

    debugLog(`Loading handler... (${funOptions.handlerPath})`);
    const handler = require(funOptions.handlerPath)[funOptions.handlerName];

    if (typeof handler !== 'function') {
      throw new Error(`Serverless-offline: handler for '${funOptions.funName}' is not a function`);
    }

    return handler;
  },
};
