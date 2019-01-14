'use strict';

const debugLog = require('./debugLog');
const fork = require('child_process').fork;
const path = require('path');
const uuid = require('uuid/v4');

const handlerCache = {};
const messageCallbacks = {};

module.exports = {
  getFunctionOptions(fun, funName, servicePath) {

    // Split handler into method name and path i.e. handler.run
    // Support nested paths i.e. ./src/somefolder/.handlers/handler.run
    const lastIndexOfDelimiter = fun.handler.lastIndexOf('.');
    const handlerPath = fun.handler.substr(0, lastIndexOfDelimiter);
    const handlerName = fun.handler.substr(lastIndexOfDelimiter + 1);

    return {
      funName,
      handlerName, // i.e. run
      handlerPath: path.join(servicePath, handlerPath),
      funTimeout: (fun.timeout || 30) * 1000,
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
        env: process.env,
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
        if (!key.match(options.cacheInvalidationRegex || /node_modules/)) delete require.cache[key];
      }
      const currentFilePath = __filename;
      if (require.cache[currentFilePath] && require.cache[currentFilePath].children) {
        const nextChildren = [];

        require.cache[currentFilePath].children.forEach(moduleCache => {
          if (moduleCache.filename.match(options.cacheInvalidationRegex || /node_modules/)) {
            nextChildren.push(moduleCache);
          }
        });

        require.cache[currentFilePath].children = nextChildren;
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
