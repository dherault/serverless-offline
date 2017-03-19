'use strict';

const debugLog = require('./debugLog');
const path = require('path');
const execSync = require('child_process').execSync;

module.exports = {
  getFunctionOptions(fun, funName, servicePath) {

    // Split handler into method name and path i.e. handler.run
    const handlerPath = fun.handler.split('.')[0];
    const handlerName = fun.handler.split('/').pop().split('.')[1];

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

    const handler = options.verboseHandlerLoader ? this.verboseHandlerLoader(funOptions) : this.handlerLoader(funOptions);

    if (typeof handler !== 'function') {
      throw new Error(`Serverless-offline: handler for '${funOptions.funName}' is not a function`);
    }

    return handler;
  },

  // require module/handler from handlerPath
  handlerLoader(funOptions) {
    debugLog(`Loading handler... (${funOptions.handlerPath})`);

    return require(funOptions.handlerPath)[funOptions.handlerName];
  },

  // Verbose Load lambda handler and better loading errors
  // Attempts to load handlerPath
  // On failure, it execs the handleFile and throw interpreter errors
  // This is workaround for node 4.x, should be fixed in 6+
  // https://github.com/nodejs/node/issues/2762
  verboseHandlerLoader(funOptions) {
    debugLog(`Loading handler (verbose)... (${funOptions.handlerPath})`);

    let moduleLoadError,
      handler;

    // Basic to attempt to load handler
    try {
      handler = require(funOptions.handlerPath)[funOptions.handlerName];
    }
    catch (error) {
      moduleLoadError = error;
    }

    // Let's try to get a better, more in depth error stack
    if (moduleLoadError) {
      try {
        const ext = path.extname(funOptions.handlerPath);
        execSync(`node ${funOptions.handlerPath}${ext ? '' : '.js'}`, { stdio: [null, null] });
      }
      catch (execError) {
        // remove internal exec failed message (useless trace to Offline users)
        const stack = execError.stack.split('\n');
        stack.shift();
        execError.stack = stack.join('\n');

        throw execError;
      }

      // Unable to find deeper error from manually loading
      // throwing require error
      throw moduleLoadError;
    }

    return handler;
  },

};
