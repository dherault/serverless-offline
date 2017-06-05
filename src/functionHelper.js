'use strict';

const debugLog = require('./debugLog');

module.exports = {
  getFunctionOptions(fun, funName, servicePath) {

    // Split handler into method name and path i.e. handler.run
    const [handlerPath, ...handlerName] = fun.handler.split('/').pop().split('.');

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
    const handlerFile = require(funOptions.handlerPath);
    const handler = funOptions.handlerName.reduce((acc, name) => acc[name], handlerFile);

    if (typeof handler !== 'function') {
      throw new Error(`Serverless-offline: handler for '${funOptions.funName}' is not a function`);
    }

    return handler;
  },
};
