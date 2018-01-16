'use strict';

const debugLog = require('./debugLog');

module.exports = {
  getFunctionOptions(fun, funName, servicePath) {

    // Split handler into method name and path i.e. handler.run at the last dot
    const handlerSeperationIndex = fun.handler.lastIndexOf('.');
    const handlerPath = fun.handler.substr(0, handlerSeperationIndex);
    const handlerName = fun.handler.substr(handlerSeperationIndex+1);

    return {
      funName,
      handlerName, // i.e. run
      handlerPath: `${servicePath}/${handlerPath}`,
      funTimeout: (fun.timeout || 30) * 1000,
      babelOptions: ((fun.custom || {}).runtime || {}).babel,
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
