'use strict';

/*
  I'm against monolithic code like this file but splitting it induces unneeded complexity
*/
module.exports = S => {

  // One-line coffee-script support
  require('coffee-script/register');

  // Node dependencies
  const fs = require('fs');
  const path = require('path');

  // External dependencies
  const Hapi = require('hapi');
  const isPlainObject = require('lodash.isplainobject');
  const serverlessLog = S.config && S.config.serverlessPath ?
    require(path.join(S.config.serverlessPath, 'utils', 'cli')).log :
    console.log.bind(null, 'Serverless:');

  // Internal lib
  const debugLog = require('./debugLog');
  const jsonPath = require('./jsonPath');
  const createLambdaContext = require('./createLambdaContext');
  const createVelocityContext = require('./createVelocityContext');
  const renderVelocityTemplateObject = require('./renderVelocityTemplateObject');

  function logPluginIssue() {
    serverlessLog('If you think this is an issue with the plugin please submit it, thanks!');
    serverlessLog('https://github.com/dherault/serverless-offline/issues');
  }

  return class Offline extends S.classes.Plugin {

    static getName() {
      return 'serverless-offline';
    }

    registerActions() {
      S.addAction(this.start.bind(this), {
        context:       'offline', // calling 'sls offline'
        contextAction: 'start', // followed by 'start'
        handler:       'start', // will invoke the start method
        description:   'Simulates API Gateway to call your lambda functions offline',
        options:       [
          {
            option:      'prefix',
            shortcut:    'p',
            description: 'Adds a prefix to every path, to send your requests to http://localhost:3000/prefix/[your_path] instead.'
          },
          {
            option:      'port',
            shortcut:    'P',
            description: 'Port to listen on. Default: 3000'
          },
          {
            option:       'stage',
            shortcut:     's',
            description:  'The stage used to populate your templates. Default: the first stage found in your project'
          },
          {
            option:       'region',
            shortcut:     'r',
            description:  'The region used to populate your templates. Default: the first region for the first stage found.'
          },
          {
            option:       'skipCacheInvalidation',
            shortcut:     'c',
            description:  'Tells the plugin to skip require cache invalidation. A script reloading tool like Nodemon might then be needed'
          },
          {
            option:       'httpsProtocol',
            shortcut:     'H',
            description:  'To enable HTTPS, specify directory (relative to your cwd, typically your project dir) for both cert.pem and key.pem files.'
          },
          {
            option:       'noTimeout',
            shortcut:     't',
            description:  'Disable the timeout feature.'
          }
        ]
      });
      return Promise.resolve();
    }

    registerHooks() {
      return Promise.resolve();
    }

    // Entry point for the plugin (sls offline start)
    start(optionsAndData) {

      // Serverless version checking
      const version = S._version;
      if (!version.startsWith('0.5')) {
        serverlessLog(`Offline requires Serverless v0.5.x but found ${version}. Exiting.`);
        process.exit(0);
      }

      // Internals
      process.env.IS_OFFLINE = true;  // Some users would like to know their environment outside of the handler
      this.project = S.getProject();  // All the project data
      this.requests = {};             // Maps a request id to the request's state (done: bool, timeout: timer)
      this.envVars = {};              // Env vars are specific to each handler

      // Methods
      this._setOptions();     // Will create meaningful options from cli options
      this._registerBabel();  // Support for ES6
      this._createServer();   // Hapijs boot
      this._createRoutes();   // API  Gateway emulation
      this._create404Route(); // Not found handling
      this._listen();         // Hapijs listen
    }

    _setOptions() {

      if (!S.cli || !S.cli.options) throw new Error('Offline could not load options from Serverless');

      const userOptions = S.cli.options;
      const stages = this.project.stages;
      const stagesKeys = Object.keys(stages);

      if (!stagesKeys.length) {
        serverlessLog('Offline could not find a default stage for your project: it looks like your _meta folder is empty. If you cloned your project using git, try "sls project init" to recreate your _meta folder');
        process.exit(0);
      }

      // Applies defaults
      this.options = {
        port: userOptions.port || 3000,
        prefix: userOptions.prefix || '/',
        stage: userOptions.stage || stagesKeys[0],
        noTimeout: userOptions.noTimeout || false,
        httpsProtocol: userOptions.httpsProtocol || '',
        skipCacheInvalidation: userOptions.skipCacheInvalidation || false,
      };

      const stageVariables = stages[this.options.stage];
      this.options.region = userOptions.region || Object.keys(stageVariables.regions)[0];

      // Prefix must start and end with '/'
      if (!this.options.prefix.startsWith('/')) this.options.prefix = '/' + this.options.prefix;
      if (!this.options.prefix.endsWith('/')) this.options.prefix += '/';

      this.globalBabelOptions = ((this.project.custom || {})['serverless-offline'] || {}).babelOptions;

      this.velocityContextOptions = {
        stageVariables,
        stage: this.options.stage,
      };

      serverlessLog(`Starting Offline: ${this.options.stage}/${this.options.region}.`);
      debugLog('options:', this.options);
      debugLog('globalBabelOptions:', this.globalBabelOptions);
    }

    _registerBabel(isBabelRuntime, babelRuntimeOptions) {

      // Babel options can vary from handler to handler just like env vars
      const options = isBabelRuntime ?
        babelRuntimeOptions || { presets: ['es2015'] } :
        this.globalBabelOptions;

      if (options) {
        debugLog('Setting babel register:', options);

        // We invoke babel-register only once
        if (!this.babelRegister) {
          debugLog('For the first time');
          this.babelRegister = require('babel-register');
        }

        // But re-set the options at each handler invocation
        this.babelRegister(options);
      }
    }

    _createServer() {

      // Hapijs server creation
      this.server = new Hapi.Server({
        connections: {
          router: {
            stripTrailingSlash: true // removes trailing slashes on incoming paths.
          }
        }
      });

      const connectionOptions = { port: this.options.port };
      const httpsDir = this.options.httpsProtocol;

      // HTTPS support
      if (typeof httpsDir === 'string' && httpsDir.length > 0) connectionOptions.tls = {
        key: fs.readFileSync(path.resolve(httpsDir, 'key.pem'), 'ascii'),
        cert: fs.readFileSync(path.resolve(httpsDir, 'cert.pem'), 'ascii')
      };

      // Passes the configuration object to the server
      this.server.connection(connectionOptions);
    }

    _createRoutes() {
      const functions = this.project.getAllFunctions();
      const defaultContentType = 'application/json';

      functions.forEach(fun => {

        // Runtime checks
        // No python or Java :'(
        const funRuntime = fun.runtime;
        if (['nodejs', 'nodejs4.3', 'babel'].indexOf(funRuntime) === -1) {
          console.log();
          serverlessLog(`Warning: found unsupported runtime '${funRuntime}' for function '${fun.name}'`);
          return;
        }

        // Templates population (with project variables)
        let populatedFun;
        try {
          populatedFun = fun.toObjectPopulated({
            stage: this.options.stage,
            region: this.options.region,
          });
        }
        catch(err) {
          serverlessLog(`Error while populating function '${fun.name}' with stage '${this.options.stage}' and region '${this.options.region}':`);
          this._logAndExit(err.stack);
        }

        const funName = populatedFun.name;
        const handlerParts = populatedFun.handler.split('/').pop().split('.');
        const handlerPath = fun.getRootPath(handlerParts[0]);
        const funTimeout = (populatedFun.timeout || 6) * 1000;
        const funBabelOptions = ((populatedFun.custom || {}).runtime || {}).babel;

        console.log();
        debugLog(funName, 'runtime', funRuntime, funBabelOptions || '');
        serverlessLog(`Routes for ${funName}:`);

        // Adds a route for each endpoint
        populatedFun.endpoints.forEach(endpoint => {

          let firstCall = true;

          const epath = endpoint.path;
          const method = endpoint.method.toUpperCase();
          const requestTemplates = endpoint.requestTemplates;

          // Prefix must start and end with '/' BUT path must not end with '/'
          let path = this.options.prefix + (epath.startsWith('/') ? epath.slice(1) : epath);
          if (path !== '/' && path.endsWith('/')) path = path.slice(0, -1);

          serverlessLog(`${method} ${path}`);

          // Route configuration
          const config = { cors: true };

          this.server.route({
            method,
            path,
            config,
            handler: (request, reply) => { // Here we go
              console.log();
              serverlessLog(`${method} ${request.url.path} (λ: ${funName})`);
              if (firstCall) {
                serverlessLog('The first request might take a few extra seconds');
                firstCall = false;
              }

              // Shared mutable state is the root of all evil they say
              const requestId = Math.random().toString().slice(2);
              this.requests[requestId] = { done: false };
              this.currentRequestId = requestId;

              // Holds the response to do async op
              const response = reply.response().hold();
              const contentType = request.mime || defaultContentType;
              const requestTemplate = requestTemplates[contentType];

              debugLog('requestId:', requestId);
              debugLog('contentType:', contentType);
              debugLog('requestTemplate:', requestTemplate);
              debugLog('payload:', request.payload);

              /* ENVIRONMENT VARIABLES DECLARATION */

              // Clears old vars
              for (let key in this.envVars) {
                delete process.env[key];
              }

              // Declares new ones
              this.envVars = isPlainObject(populatedFun.environment) ? populatedFun.environment : {};
              for (let key in this.envVars) {
                process.env[key] = this.envVars[key];
              }

              /* BABEL CONFIGURATION */

              this._registerBabel(funRuntime === 'babel', funBabelOptions);

              /* HANDLER LAZY LOADING */

              let handler; // The lambda function

              try {
                if (!this.options.skipCacheInvalidation) {
                  debugLog('Invalidating cache...');

                  for (let key in require.cache) {
                    // Require cache invalidation, brutal and fragile.
                    // Might cause errors, if so please submit an issue.
                    if (!key.match('node_modules')) delete require.cache[key];
                  }
                }

                debugLog(`Loading handler... (${handlerPath})`);
                handler = require(handlerPath)[handlerParts[1]];
                if (typeof handler !== 'function') throw new Error(`Serverless-offline: handler for '${funName}' is not a function`);
              }
              catch(err) {
                return this._reply500(response, `Error while loading ${funName}`, err, requestId);
              }

              /* REQUEST TEMPLATE PROCESSING (event population) */

              let event = {};

              if (requestTemplate) {
                try {
                  debugLog('_____ REQUEST TEMPLATE PROCESSING _____');
                  // Velocity templating language parsing
                  const velocityContext = createVelocityContext(request, this.velocityContextOptions, request.payload || {});
                  event = renderVelocityTemplateObject(requestTemplate, velocityContext);
                }
                catch (err) {
                  return this._reply500(response, `Error while parsing template "${contentType}" for ${funName}`, err, requestId);
                }
              }

              event.isOffline = true;
              debugLog('event:', event);

              // We create the context, its callback (context.done/succeed/fail) will send the HTTP response
              const lambdaContext = createLambdaContext(populatedFun, (err, data) => {
                // Everything in this block happens once the lambda function has resolved
                debugLog('_____ HANDLER RESOLVED _____');

                // Timeout clearing if needed
                if (this._clearTimeout(requestId)) return;

                // User should not call context.done twice
                if (this.requests[requestId].done) {
                  console.log();
                  serverlessLog(`Warning: context.done called twice within handler '${funName}'!`);
                  debugLog('requestId:', requestId);
                  return;
                }

                this.requests[requestId].done = true;

                let result = data;
                let responseName = 'default';
                let responseContentType = defaultContentType;

                /* RESPONSE SELECTION (among endpoint's possible responses) */

                // Failure handling
                if (err) {

                  const errorMessage = (err.message || err).toString();

                  // Mocks Lambda errors
                  result = {
                    errorMessage,
                    errorType: err.constructor.name,
                    stackTrace: this._getArrayStackTrace(err.stack)
                  };

                  serverlessLog(`Failure: ${errorMessage}`);
                  if (result.stackTrace) console.log(result.stackTrace.join('\n  '));

                  for (let key in endpoint.responses) {
                    if (key === 'default') continue;

                    if (errorMessage.match('^' + (endpoint.responses[key].selectionPattern || key) + '$')) {
                      responseName = key;
                      break;
                    }
                  }
                }

                debugLog(`Using response '${responseName}'`);

                const chosenResponse = endpoint.responses[responseName];

                /* RESPONSE PARAMETERS PROCCESSING */

                const responseParameters = chosenResponse.responseParameters;

                if (isPlainObject(responseParameters)) {

                  const responseParametersKeys = Object.keys(responseParameters);

                  debugLog('_____ RESPONSE PARAMETERS PROCCESSING _____');
                  debugLog(`Found ${responseParametersKeys.length} responseParameters for '${responseName}' response`);

                  responseParametersKeys.forEach(key => {

                    // responseParameters use the following shape: "key": "value"
                    const value = responseParameters[key];
                    const keyArray = key.split('.'); // eg: "method.response.header.location"
                    const valueArray = value.split('.'); // eg: "integration.response.body.redirect.url"

                    debugLog(`Processing responseParameter "${key}": "${value}"`);

                    // For now the plugin only supports modifying headers
                    if (key.startsWith('method.response.header') && keyArray[3]) {

                      const headerName = keyArray.slice(3).join('.');
                      let headerValue;
                      debugLog('Found header in left-hand:', headerName);

                      if (value.startsWith('integration.response')) {
                        if (valueArray[2] === 'body') {

                          debugLog('Found body in right-hand');
                          headerValue = (valueArray[3] ? jsonPath(result, valueArray.slice(3).join('.')) : result).toString();

                        } else {
                          console.log();
                          serverlessLog(`Warning: while processing responseParameter "${key}": "${value}"`);
                          serverlessLog(`Offline plugin only supports "integration.response.body[.JSON_path]" right-hand responseParameter. Found "${value}" instead. Skipping.`);
                          logPluginIssue();
                          console.log();
                        }
                      } else {
                        headerValue = value;
                      }
                      // Applies the header;
                      debugLog(`Will assign "${headerValue}" to header "${headerName}"`);
                      if (headerName.toLowerCase() === 'content-type' && headerValue.match(/^'.*'$/)) headerValue = headerValue.slice(1, -1); // See #34
                      response.header(headerName, headerValue);

                    }
                    else {
                      console.log();
                      serverlessLog(`Warning: while processing responseParameter "${key}": "${value}"`);
                      serverlessLog(`Offline plugin only supports "method.response.header.PARAM_NAME" left-hand responseParameter. Found "${key}" instead. Skipping.`);
                      logPluginIssue();
                      console.log();
                    }
                  });
                }

                /* RESPONSE TEMPLATE PROCCESSING */

                // If there is a responseTemplate, we apply it to the result
                const responseTemplates = chosenResponse.responseTemplates;

                if (isPlainObject(responseTemplates)) {

                  const responseTemplatesKeys = Object.keys(responseTemplates);

                  if (responseTemplatesKeys.length) {

                    // BAD IMPLEMENTATION: first key in responseTemplates
                    const templateName = responseTemplatesKeys[0];
                    const responseTemplate = responseTemplates[templateName];

                    responseContentType = templateName;

                    if (responseTemplate) {

                      debugLog('_____ RESPONSE TEMPLATE PROCCESSING _____');
                      debugLog(`Using responseTemplate '${templateName}'`);

                      try {
                        const reponseContext = createVelocityContext(request, this.velocityContextOptions, result);
                        result = renderVelocityTemplateObject({ root: responseTemplate }, reponseContext).root;
                      }
                      catch (err) {
                        serverlessLog(`Error while parsing responseTemplate '${templateName}' for lambda ${funName}:`);
                        console.log(err.stack);
                      }
                    }
                  }
                }

                /* HAPIJS RESPONSE CONFIGURATION */

                const statusCode = chosenResponse.statusCode || 200;
                if (!chosenResponse.statusCode) {
                  console.log();
                  serverlessLog(`Warning: No statusCode found for response "${responseName}".`);
                }

                response.header('Content-Type', responseContentType, {
                  override: false, // Maybe a responseParameter set it already. See #34
                });
                response.statusCode = statusCode;
                response.source = result;

                // Log response
                let whatToLog = result;

                try {
                  whatToLog = JSON.stringify(result);
                }
                catch(err) {
                  // nothing
                }
                finally {
                  serverlessLog(err ? `Replying ${statusCode}` : `[${statusCode}] ${whatToLog}`);
                  debugLog('requestId:', requestId);
                }

                // Bon voyage!
                response.send();
              });

              // Now we are outside of createLambdaContext, so this happens before the handler gets called:

              // We cannot use Hapijs's timeout feature because the logic above can take a significant time, so we implement it ourselves
              this.requests[requestId].timeout = this.options.noTimeout ?
                undefined :
                setTimeout(this._replyTimeout.bind(this, response, funName, funTimeout, requestId), funTimeout);

              // Finally we call the handler
              debugLog('_____ CALLING HANDLER _____');
              try {
                const x = handler(event, lambdaContext, lambdaContext.done);

                // Promise support
                if (funRuntime === 'babel' && !this.requests[requestId].done) {
                  if (x && typeof x.then === 'function' && typeof x.catch === 'function') x
                    .then(lambdaContext.succeed)
                    .catch(lambdaContext.fail);
                  else if (x instanceof Error) lambdaContext.fail(x);
                  else lambdaContext.succeed(x);
                }
              }
              catch(err) {
                return this._reply500(response, `Uncaught error in your '${funName}' handler`, err, requestId);
              }
            },
          });
        });
      });
    }

    // All done, we can listen to incomming requests
    _listen() {
      this.server.start(err => {
        if (err) throw err;
        console.log();
        serverlessLog(`Offline listening on http${this.options.httpsProtocol ? 's' : ''}://localhost:${this.options.port}`);
      });
    }

    // Bad news
    _reply500(response, message, err, requestId) {

      if (this._clearTimeout(requestId)) return;

      this.requests[requestId].done = true;

      const stackTrace = this._getArrayStackTrace(err.stack);

      serverlessLog(message);
      console.log(stackTrace || err);

      response.statusCode = 200; // APIG replies 200 by default on failures
      response.source = {
        errorMessage: message,
        errorType: err.constructor.name,
        stackTrace,
        offlineInfo: 'If you believe this is an issue with the plugin please submit it, thanks. https://github.com/dherault/serverless-offline/issues',
      };
      serverlessLog(`Replying error in handler`);
      response.send();
    }

    _replyTimeout(response, funName, funTimeout, requestId) {
      if (this.currentRequestId !== requestId) return;

      this.requests[requestId].done = true;

      serverlessLog(`Replying timeout after ${funTimeout}ms`);
      response.statusCode = 503;
      response.source = `[Serverless-Offline] Your λ handler '${funName}' timed out after ${funTimeout}ms.`;
      response.send();
    }

    _clearTimeout(requestId) {
      const timeout = this.requests[requestId].timeout;
      if (timeout && timeout._called) return true;
      else clearTimeout(timeout);
    }

    _create404Route() {
      this.server.route({
        method: '*',
        path: '/{p*}',
        config: { cors: true },
        handler: (request, reply) => {
          const response = reply({
            statusCode: 404,
            error: 'Serverless-offline: route not found.',
            currentRoute: `${request.method} - ${request.path}`,
            existingRoutes: this.server.table()[0].table
              .filter(route => route.path !== '/{p*}') // Exclude this (404) route
              .sort((a, b) => a.path <= b.path ? -1 : 1) // Sort by path
              .map(route => `${route.method} - ${route.path}`), // Human-friendly result
          });
          response.statusCode = 404;
        }
      });
    }

    _getArrayStackTrace(stack) {
      if (!stack) return null;

      const splittedStack = stack.split('\n');

      return splittedStack.slice(0, splittedStack.findIndex(item => item.match(/server.route.handler.createLambdaContext/))).map(line => line.trim());
    }

    _logAndExit() {
      console.log.apply(null, arguments);
      process.exit(0);
    }
  };
};
