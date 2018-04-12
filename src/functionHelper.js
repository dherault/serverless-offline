'use strict';

const debugLog = require('./debugLog');
const fork = require('child_process').fork;
const _ = require('lodash');
const path = require('path');
const uuid = require('uuid/v4');

const handlerCache = {};
const messageCallbacks = {};

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

  createExternalHandler(funOptions, options) {
    let handlerContext = handlerCache[funOptions.handlerPath];

    function handleFatal(error) {
      debugLog(`External handler receieved fatal error ${JSON.stringify(error)}`);
      handlerContext.inflight.forEach(id => messageCallbacks[id](error));
      handlerContext.inflight.clear();
      delete handlerCache[funOptions.handlerPath];
    }

    if (!handlerContext) {
      debugLog(`Loading external handler... (${funOptions.handlerPath})`);

      const helperPath = path.resolve(__dirname, 'ipcHelper.js');
      const ipcProcess = fork(helperPath, [funOptions.handlerPath], {
        env: _.omitBy(process.env, _.isUndefined),
        stdio: [0, 1, 2, 'ipc'],
      });
      handlerContext = { process: ipcProcess, inflight: new Set() };
      if (options.skipCacheInvalidation) {
        handlerCache[funOptions.handlerPath] = handlerContext;
      }

      ipcProcess.on('message', message => {
        debugLog(`External handler received message ${JSON.stringify(message)}`);
        if (message.id) {
          messageCallbacks[message.id](message.error, message.ret);
          handlerContext.inflight.delete(message.id);
          delete messageCallbacks[message.id];
        }
        else if (message.error) {
          // Handler died!
          handleFatal(message.error);
        }

        if (!options.skipCacheInvalidation) {
          handlerContext.process.kill();
          delete handlerCache[funOptions.handlerPath];
        }
      });

      ipcProcess.on('error', error => handleFatal(error));
      ipcProcess.on('exit', code => handleFatal(`Handler process exited with code ${code}`));
    }
    else {
      debugLog(`Using existing external handler for ${funOptions.handlerPath}`);
    }

    return (event, context, done) => {
      const id = uuid();
      messageCallbacks[id] = done;
      handlerContext.inflight.add(id);
      handlerContext.process.send({ id, name: funOptions.handlerName, event, context });
    };
  },

  // Create a function handler
  // The function handler is used to simulate Lambda functions
  createHandler(funOptions, options) {
    if (options.useSeparateProcesses) {
      return this.createExternalHandler(funOptions, options);
    }

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
