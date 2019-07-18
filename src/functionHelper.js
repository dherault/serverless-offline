'use strict';

const { fork, spawn } = require('child_process');
const path = require('path');
const debugLog = require('./debugLog');
const { createUniqueId } = require('./utils');

const handlerCache = {};
const messageCallbacks = {};

function runProxyHandler(funOptions, options) {
  return (event, context) => {
    const args = ['invoke', 'local', '-f', funOptions.funName];
    const stage = options.s || options.stage;

    if (stage) args.push('-s', stage);

    // Use path to binary if provided, otherwise assume globally-installed
    const binPath = options.b || options.binPath;
    const cmd = binPath || 'sls';

    const process = spawn(cmd, args, {
      cwd: funOptions.servicePath,
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    process.stdin.write(`${JSON.stringify(event)}\n`);
    process.stdin.end();

    const results = [];
    process.stdout.on('data', (data) => {
      // data can be called multiple times
      // for example in python with print statements,
      // log lines and a returned dict
      // this will be called 2 times
      // first with print data (multiple print calls == 1 call here)
      // next with return value + log statements as a single data call
      results.push(data.toString('utf8'));
    });

    process.stderr.on('data', data => {
      context.fail(data);
    });

    process.on('close', code => {
      if (code.toString() === '0') {
        // try to parse to json
        // valid result should be a json array | object
        // technically a string is valid json
        // but everything comes back as a string
        // so we can't reliably detect json primitives with this method
        let response = null;
        // we go end to start because the one we want should be last
        // or next to last
        for (let i = results.length - 1; i >= 0; i--) {
          // now we need to find the min | max [] or {} within the string
          // if both exist then we need the outer one.
          // { "something": [] } is valid,
          // [{"something": "valid"}] is also valid
          // *NOTE* Doesn't currently support 2 separate valid json bundles
          // within a single result.
          // this can happen if you use a python logger
          // and then do log.warn(json.dumps({'stuff': 'here'}))
          const item = results[i];
          const firstCurly = item.indexOf('{');
          const firstSquare = item.indexOf('[');
          let start = 0;
          let end = item.length;
          if(firstCurly === -1 && firstSquare === -1){
            // no json found
            continue;
          }
          if(firstSquare === -1 || firstCurly < firstSquare){
            // found an object
            start = firstCurly;
            end = item.lastIndexOf('}') + 1;
          } else if(firstCurly === -1 || firstSquare < firstCurly){
            // found an array
            start = firstSquare;
            end = item.lastIndexOf(']') + 1;
          }

          try {
            response = JSON.parse(item.substring(start, end));
            break;
          } catch (err) {
            // not json, check the next one
            continue;
          }
        }
        if(response !== null){
          context.succeed(response);
        } else {
          context.fail(results.join('\n'));
        }

      } else {
        // this seems wrong, should we succeed here?
        context.succeed(code, results);
      }
    });
  };
}

exports.getFunctionOptions = function getFunctionOptions(
  fun,
  funName,
  servicePath,
  serviceRuntime,
) {
  // Split handler into method name and path i.e. handler.run
  // Support nested paths i.e. ./src/somefolder/.handlers/handler.run
  const lastIndexOfDelimiter = fun.handler.lastIndexOf('.');
  const handlerPath = fun.handler.substr(0, lastIndexOfDelimiter);
  const handlerName = fun.handler.substr(lastIndexOfDelimiter + 1);

  return {
    funName,
    funTimeout: (fun.timeout || 30) * 1000,
    handlerName, // i.e. run
    handlerPath: path.join(servicePath, handlerPath),
    memorySize: fun.memorySize,
    runtime: fun.runtime || serviceRuntime,
  };
};

exports.createExternalHandler = function createExternalHandler(
  funOptions,
  options,
) {
  let handlerContext = handlerCache[funOptions.handlerPath];

  function handleFatal(error) {
    debugLog(`External handler received fatal error ${JSON.stringify(error)}`);
    handlerContext.inflight.forEach((id) => messageCallbacks[id](error));
    handlerContext.inflight.clear();
    delete handlerCache[funOptions.handlerPath];
  }

  if (!handlerContext) {
    debugLog(`Loading external handler... (${funOptions.handlerPath})`);

    const helperPath = path.resolve(__dirname, 'ipcHelper.js');
    const env = {};
    for (const key of Object.getOwnPropertyNames(process.env)) {
      if (process.env[key] !== undefined && process.env[key] !== 'undefined')
        env[key] = process.env[key];
    }

    const ipcProcess = fork(helperPath, [funOptions.handlerPath], {
      env,
      stdio: [0, 1, 2, 'ipc'],
    });

    handlerContext = { process: ipcProcess, inflight: new Set() };

    if (options.skipCacheInvalidation) {
      handlerCache[funOptions.handlerPath] = handlerContext;
    }

    ipcProcess.on('message', (message) => {
      debugLog(`External handler received message ${JSON.stringify(message)}`);
      if (message.id && messageCallbacks[message.id]) {
        messageCallbacks[message.id](message.error, message.ret);
        handlerContext.inflight.delete(message.id);
        delete messageCallbacks[message.id];
      } else if (message.error) {
        // Handler died!
        handleFatal(message.error);
      }

      if (!options.skipCacheInvalidation) {
        handlerContext.process.kill();
        delete handlerCache[funOptions.handlerPath];
      }
    });

    ipcProcess.on('error', (error) => handleFatal(error));
    ipcProcess.on('exit', (code) =>
      handleFatal(`Handler process exited with code ${code}`),
    );
  } else {
    debugLog(`Using existing external handler for ${funOptions.handlerPath}`);
  }

  return (event, context, done) => {
    const id = createUniqueId();
    messageCallbacks[id] = done;
    handlerContext.inflight.add(id);
    handlerContext.process.send(
      Object.assign({}, funOptions, { id, event, context }),
    );
  };
};

// Create a function handler
// The function handler is used to simulate Lambda functions
exports.createHandler = function createHandler(funOptions, options) {
  if (options.useSeparateProcesses) {
    return this.createExternalHandler(funOptions, options);
  }

  if (!options.skipCacheInvalidation) {
    debugLog('Invalidating cache...');

    for (const key in require.cache) {
      // Require cache invalidation, brutal and fragile.
      // Might cause errors, if so please submit an issue.
      if (!key.match(options.cacheInvalidationRegex || /node_modules/))
        delete require.cache[key];
    }
    const currentFilePath = __filename;
    if (
      require.cache[currentFilePath] &&
      require.cache[currentFilePath].children
    ) {
      const nextChildren = [];

      require.cache[currentFilePath].children.forEach((moduleCache) => {
        if (
          moduleCache.filename.match(
            options.cacheInvalidationRegex || /node_modules/,
          )
        ) {
          nextChildren.push(moduleCache);
        }
      });

      require.cache[currentFilePath].children = nextChildren;
    }
  }

  debugLog(`Loading handler... (${funOptions.handlerPath})`);

  let handler = null;

  if (funOptions.runtime.startsWith('nodejs')) {
    handler = require(funOptions.handlerPath)[funOptions.handlerName];
  } else {
    handler = runProxyHandler(funOptions, options);
  }

  if (typeof handler !== 'function') {
    throw new Error(
      `Serverless-offline: handler for '${funOptions.funName}' is not a function`,
    );
  }

  return handler;
};

exports.cleanup = function cleanup() {
  for (const key in handlerCache) {
    handlerCache[key].process.kill();
  }
};
