'use strict';

const Boom = require('boom');

const createLambdaContext = require('./createLambdaContext');
const debugLog = require('./debugLog');

module.exports = {
  getFunctionOptions: function(fun, populatedFun) {
    const handlerParts = fun.handler.split('/').pop().split('.');
    return {
      handlerName: handlerParts[1],
      handlerPath: fun.getRootPath(handlerParts[0]),
      funTimeout: (populatedFun.timeout || 6) * 1000,
      babelOptions: ((populatedFun.custom || {}).runtime || {}).babel,
    };
  },

  createHandler: function(funOptions, options) {
    if (!options.skipCacheInvalidation) {
      debugLog('Invalidating cache...');

      for (let key in require.cache) { // eslint-disable-line prefer-const
        // Require cache invalidation, brutal and fragile.
        // Might cause errors, if so please submit an issue.
        if (!key.match('node_modules')) delete require.cache[key];
      }
    }

    debugLog(`Loading handler... (${funOptions.handlerPath})`);
    const handler = require(funOptions.handlerPath)[funOptions.handlerName];

    if (typeof handler !== 'function') {
      throw new Error(`Serverless-offline: handler for '${funName}' is not a function`);
    }

    return handler;
  }
}
