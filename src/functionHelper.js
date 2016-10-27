'use strict';

const debugLog = require('./debugLog');

let requireOverrides = [];

function doRequire(options){
  const key = `${options.handlerPath}.${options.handlerName}`;
  const override = requireOverrides[key];
  if (override) {
    debugLog(`Calling overridden require for ${key}`);
    return override();
  }
  return require(options.handlerPath);
}

module.exports = {
  getFunctionOptions(fun, funName, servicePath) {

    // Split handler into method name and path i.e. handler.run
    const handlerPath = fun.handler.split('.')[0];
    const handlerName = fun.handler.split('/').pop().split('.')[1];
    return {
      funName,
      handlerName, // i.e. run
      handlerPath: `${servicePath}/${handlerPath}`,
      funTimeout: (fun.timeout || 6) * 1000,
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
    const handler = doRequire(funOptions)[funOptions.handlerName];

    if (typeof handler !== 'function') {
      throw new Error(`Serverless-offline: handler for '${funOptions.funName}' is not a function`);
    }

    return handler;
  },

  // Takes options: { handlerPath: 'foo', handlerName: 'baz', doRequire: () => my_require('foo') }
  overrideRequire(options) {
    const key = `${options.handlerPath}.${options.handlerName}`
    debugLog(`Overriding require for ${key}`);
    requireOverrides[key] = options.doRequire
  }
};
