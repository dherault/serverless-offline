'use strict';

// One-line coffee-script support
require('coffee-script/register');

// Node dependencies
const fs = require('fs');
const path = require('path');

// External dependencies
const Hapi = require('hapi');
const isPlainObject = require('lodash.isplainobject');

// Internal lib
require('./javaHelper');
const resetEnvVariables = require('./resetEnvVariables');
const debugLog = require('./debugLog');
const jsonPath = require('./jsonPath');
const createLambdaContext = require('./createLambdaContext');
const createVelocityContext = require('./createVelocityContext');
const renderVelocityTemplateObject = require('./renderVelocityTemplateObject');
const createAuthScheme = require('./createAuthScheme');
const functionHelper = require('./functionHelper');
const toPlainOrEmptyObject = require('./utils').toPlainOrEmptyObject;

/*
  I'm against monolithic code like this file but splitting it induces unneeded complexity
*/
module.exports = S => {
  let serverlessLog = require(S.getServerlessPath('utils/cli')).log;
  let printBlankLine = () => console.log();

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
            description: 'Adds a prefix to every path, to send your requests to http://localhost:3000/prefix/[your_path] instead.',
          },
          {
            option:      'host',
            shortcut:    'o',
            description: 'The host name to listen on. Default: localhost',
          },
          {
            option:      'port',
            shortcut:    'P',
            description: 'Port to listen on. Default: 3000',
          },
          {
            option:      'stage',
            shortcut:    's',
            description: 'The stage used to populate your templates. Default: the first stage found in your project',
          },
          {
            option:      'region',
            shortcut:    'r',
            description: 'The region used to populate your templates. Default: the first region for the first stage found.',
          },
          {
            option:      'skipCacheInvalidation',
            shortcut:    'c',
            description: 'Tells the plugin to skip require cache invalidation. A script reloading tool like Nodemon might then be needed',
          },
          {
            option:      'httpsProtocol',
            shortcut:    'H',
            description: 'To enable HTTPS, specify directory (relative to your cwd, typically your project dir) for both cert.pem and key.pem files.',
          },
          {
            option:      'noTimeout',
            shortcut:    't',
            description: 'Disable the timeout feature.',
          },
          {
            option:      'corsAllowOrigin',
            description: 'Used to build the Access-Control-Allow-Origin header for CORS support.',
          },
          {
            option:      'corsAllowHeaders',
            description: 'Used to build the Access-Control-Allow-Headers header for CORS support.',
          },
          {
            option:      'corsDisallowCredentials',
            description: 'Used to override the Access-Control-Allow-Credentials default (which is true) to false.',
          },
        ],
      });
      return Promise.resolve();
    }

    registerHooks() {
      return Promise.resolve();
    }

    // Entry point for the plugin (sls offline start)
    start(/* optionsAndData */) {
      this._setup();
      this._listen();         // Hapijs listen
    }

    inject(req, res) {
      S.cli = { options: {} }; // eslint-disable-line
      serverlessLog = () => {};
      printBlankLine = () => {};
      this._setup();
      this.server.inject(req, res);
    }

    _setup() {
      if (this._setupComplete) return;

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

      this._setupComplete = true;
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
        host:                  userOptions.host || 'localhost',
        port:                  userOptions.port || 3000,
        prefix:                userOptions.prefix || '/',
        stage:                 userOptions.stage || stagesKeys[0],
        noTimeout:             userOptions.noTimeout || false,
        httpsProtocol:         userOptions.httpsProtocol || '',
        skipCacheInvalidation: userOptions.skipCacheInvalidation || false,
        corsAllowOrigin:       userOptions.corsAllowOrigin || '*',
        corsAllowHeaders:      userOptions.corsAllowHeaders || 'accept,content-type,x-api-key',
        corsAllowCredentials:  true,
      };

      const stageVariables = stages[this.options.stage];
      this.options.region = userOptions.region || Object.keys(stageVariables.regions)[0];

      // Prefix must start and end with '/'
      if (!this.options.prefix.startsWith('/')) this.options.prefix = `/${this.options.prefix}`;
      if (!this.options.prefix.endsWith('/')) this.options.prefix += '/';

      this.globalBabelOptions = ((this.project.custom || {})['serverless-offline'] || {}).babelOptions;

      this.velocityContextOptions = {
        stageVariables,
        stage: this.options.stage,
      };

      // Parse CORS options
      this.options.corsAllowOrigin = this.options.corsAllowOrigin.replace(/\s/g, '').split(',');
      this.options.corsAllowHeaders = this.options.corsAllowHeaders.replace(/\s/g, '').split(',');

      if (userOptions.corsDisallowCredentials) this.options.corsAllowCredentials = false;

      this.options.corsConfig = {
        origin: this.options.corsAllowOrigin,
        headers: this.options.corsAllowHeaders,
        credentials: this.options.corsAllowCredentials,
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
            stripTrailingSlash: true, // removes trailing slashes on incoming paths.
          },
        },
      });

      const connectionOptions = { host: this.options.host, port: this.options.port };
      const httpsDir = this.options.httpsProtocol;

      // HTTPS support
      if (typeof httpsDir === 'string' && httpsDir.length > 0) {
        connectionOptions.tls = {
          key:  fs.readFileSync(path.resolve(httpsDir, 'key.pem'), 'ascii'),
          cert: fs.readFileSync(path.resolve(httpsDir, 'cert.pem'), 'ascii'),
        };
      }

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
          printBlankLine();
          serverlessLog(`Warning: found unsupported runtime '${funRuntime}' for function '${fun.name}'`);
          return;
        }

        // Templates population (with project variables)
        let populatedFun;
        try {
          populatedFun = fun.toObjectPopulated({
            stage:  this.options.stage,
            region: this.options.region,
          });
        }
        catch (err) {
          serverlessLog(`Error while populating function '${fun.name}' with stage '${this.options.stage}' and region '${this.options.region}':`);
          this._logAndExit(err.stack);
        }

        const funName = populatedFun.name;
        const funOptions = functionHelper.getFunctionOptions(fun, populatedFun);

        printBlankLine();
        debugLog(funName, 'runtime', funRuntime, funOptions.babelOptions || '');
        serverlessLog(`Routes for ${funName}:`);

        // Adds a route for each endpoint
        populatedFun.endpoints.forEach(endpoint => {

          let firstCall = true;

          const epath = endpoint.path;
          const method = endpoint.method.toUpperCase();
          const requestTemplates = endpoint.requestTemplates;

          // Prefix must start and end with '/' BUT path must not end with '/'
          let fullPath = this.options.prefix + (epath.startsWith('/') ? epath.slice(1) : epath);
          if (fullPath !== '/' && fullPath.endsWith('/')) fullPath = path.slice(0, -1);

          serverlessLog(`${method} ${fullPath}`);

          // If the endpoint has an authorization function, create an authStrategy for the route
          let authStrategyName = null;

          if (endpoint.authorizationType === 'CUSTOM') {
            serverlessLog(`Configuring Authorization: ${endpoint.authorizationType} ${endpoint.authorizerFunction}`);
            const authFunctions = functions.filter(f => f.name === endpoint.authorizerFunction);

            if (!authFunctions.length) {
              serverlessLog(`Authorization function ${endpoint.authorizerFunction} does not exist`);
              this._logAndExit();
            }

            if (authFunctions.length > 1) {
              serverlessLog(`Multiple Authorization functions ${endpoint.authorizerFunction} found`);
              this._logAndExit();
            }

            // Create a unique scheme per endpoint
            // This allows the methodArn on the event property to be set appropriately
            const authFunction = authFunctions[0];
            const authFunctionName = authFunction.name;
            const authKey = `${funName}-${authFunctionName}-${method}-${epath}`;
            const authSchemeName = `scheme-${authKey}`;
            authStrategyName = `strategy-${authKey}`; // set strategy name for the route config

            debugLog(`Creating Authorization scheme for ${authKey}`);

            // Create the Auth Scheme for the endpoint
            const scheme = createAuthScheme(authFunction, funName, epath, this.options, serverlessLog);

            // Set the auth scheme and strategy on the server
            this.server.auth.scheme(authSchemeName, scheme);
            this.server.auth.strategy(authStrategyName, authSchemeName);
          }

          const routeConfig = {
            cors: this.options.corsConfig,
            auth: authStrategyName,
          };

          if (method !== 'GET' && method !== 'HEAD') {
            routeConfig.payload = {
              parse: false,
            };
          }

          // Route creation
          this.server.route({
            method,
            path:    fullPath,
            config:  routeConfig,
            handler: (request, reply) => { // Here we go
              printBlankLine();
              serverlessLog(`${method} ${request.path} (λ: ${funName})`);
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

              const contentTypesThatRequirePayloadParsing = ['application/json', 'application/vnd.api+json'];

              if (contentTypesThatRequirePayloadParsing.includes(contentType)) {
                try {
                  request.payload = JSON.parse(request.payload);
                } catch (err) {
                  request.payload = {};
                }
              }

              debugLog('requestId:', requestId);
              debugLog('contentType:', contentType);
              debugLog('requestTemplate:', requestTemplate);
              debugLog('payload:', request.payload);

              /* ENVIRONMENT VARIABLES DECLARATION */

              const newEnvVars = toPlainOrEmptyObject(populatedFun.environment);
              resetEnvVariables(this.envVars, newEnvVars);
              this.envVars = newEnvVars;

              /* BABEL CONFIGURATION */

              this._registerBabel(funRuntime === 'babel', funOptions.babelOptions);

              /* HANDLER LAZY LOADING */

              let handler; // The lambda function

              try {
                handler = functionHelper.createHandler(funOptions, this.options);
              } catch (err) {
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
                } catch (err) {
                  return this._reply500(response, `Error while parsing template "${contentType}" for ${funName}`, err, requestId);
                }
              } else if (request.payload && typeof request.payload === 'object') {
                event = request.payload || {};
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
                  printBlankLine();
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
                    errorType:  err.constructor.name,
                    stackTrace: this._getArrayStackTrace(err.stack),
                  };

                  serverlessLog(`Failure: ${errorMessage}`);
                  if (result.stackTrace) console.log(result.stackTrace.join('\n  '));

                  for (const key in endpoint.responses) {
                    if (key === 'default') continue;

                    if (errorMessage.match(`^${endpoint.responses[key].selectionPattern || key}$`)) {
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
                          printBlankLine();
                          serverlessLog(`Warning: while processing responseParameter "${key}": "${value}"`);
                          serverlessLog(`Offline plugin only supports "integration.response.body[.JSON_path]" right-hand responseParameter. Found "${value}" instead. Skipping.`);
                          logPluginIssue();
                          printBlankLine();
                        }
                      } else {
                        headerValue = value.match(/^'.*'$/) ? value.slice(1, -1) : value; // See #34
                      }
                      // Applies the header;
                      debugLog(`Will assign "${headerValue}" to header "${headerName}"`);
                      response.header(headerName, headerValue);

                    } else {
                      printBlankLine();
                      serverlessLog(`Warning: while processing responseParameter "${key}": "${value}"`);
                      serverlessLog(`Offline plugin only supports "method.response.header.PARAM_NAME" left-hand responseParameter. Found "${key}" instead. Skipping.`);
                      logPluginIssue();
                      printBlankLine();
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
                      catch (error) {
                        serverlessLog(`Error while parsing responseTemplate '${templateName}' for lambda ${funName}:`);
                        console.log(error.stack);
                      }
                    }
                  }
                }

                /* HAPIJS RESPONSE CONFIGURATION */

                const statusCode = parseInt(chosenResponse.statusCode) || 200;
                if (!chosenResponse.statusCode) {
                  printBlankLine();
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
                catch (error) {
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
              this.requests[requestId].timeout = this.options.noTimeout ? null : setTimeout(
                this._replyTimeout.bind(this, response, funName, funOptions.funTimeout, requestId),
                funOptions.funTimeout
              );

              // Finally we call the handler
              debugLog('_____ CALLING HANDLER _____');
              try {
                const x = handler(event, lambdaContext, lambdaContext.done);

                // Promise support
                if (funRuntime === 'babel' && !this.requests[requestId].done) {
                  if (x && typeof x.then === 'function' && typeof x.catch === 'function') x.then(lambdaContext.succeed).catch(lambdaContext.fail);
                  else if (x instanceof Error) lambdaContext.fail(x);
                }
              }
              catch (error) {
                return this._reply500(response, `Uncaught error in your '${funName}' handler`, error, requestId);
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
        printBlankLine();
        serverlessLog(`Offline listening on http${this.options.httpsProtocol ? 's' : ''}://${this.options.host}:${this.options.port}`);
      });
    }

    // Bad news
    _reply500(response, message, err, requestId) {

      if (this._clearTimeout(requestId)) return;

      this.requests[requestId].done = true;

      const stackTrace = this._getArrayStackTrace(err.stack);

      serverlessLog(message);
      console.log(stackTrace || err);

      /* eslint-disable no-param-reassign */
      response.statusCode = 200; // APIG replies 200 by default on failures
      response.source = {
        errorMessage: message,
        errorType:    err.constructor.name,
        stackTrace,
        offlineInfo:  'If you believe this is an issue with the plugin please submit it, thanks. https://github.com/dherault/serverless-offline/issues',
      };
      /* eslint-enable no-param-reassign */
      serverlessLog('Replying error in handler');
      response.send();
    }

    _replyTimeout(response, funName, funTimeout, requestId) {
      if (this.currentRequestId !== requestId) return;

      this.requests[requestId].done = true;

      serverlessLog(`Replying timeout after ${funTimeout}ms`);
      /* eslint-disable no-param-reassign */
      response.statusCode = 503;
      response.source = `[Serverless-Offline] Your λ handler '${funName}' timed out after ${funTimeout}ms.`;
      /* eslint-enable no-param-reassign */
      response.send();
    }

    _clearTimeout(requestId) {
      const timeout = this.requests[requestId].timeout;
      if (timeout && timeout._called) return true;
      clearTimeout(timeout);
    }

    _create404Route() {
      this.server.route({
        method:  '*',
        path:    '/{p*}',
        config:  { cors: this.options.corsConfig },
        handler: (request, reply) => {
          const response = reply({
            statusCode:     404,
            error:          'Serverless-offline: route not found.',
            currentRoute:   `${request.method} - ${request.path}`,
            existingRoutes: this.server.table()[0].table
              .filter(route => route.path !== '/{p*}') // Exclude this (404) route
              .sort((a, b) => a.path <= b.path ? -1 : 1) // Sort by path
              .map(route => `${route.method} - ${route.path}`), // Human-friendly result
          });
          response.statusCode = 404;
        },
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
