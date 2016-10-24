'use strict';

// One-line coffee-script support
require('coffee-script/register');

// Node dependencies
const fs = require('fs');
const path = require('path');

// External dependencies
const Hapi = require('hapi');
const isPlainObject = require('lodash').isPlainObject;

// Internal lib
require('./javaHelper');
const debugLog = require('./debugLog');
const jsonPath = require('./jsonPath');
const createLambdaContext = require('./createLambdaContext');
const createVelocityContext = require('./createVelocityContext');
const createLambdaProxyContext = require('./createLambdaProxyContext');
const renderVelocityTemplateObject = require('./renderVelocityTemplateObject');
const createAuthScheme = require('./createAuthScheme');
const functionHelper = require('./functionHelper');
const Endpoint = require('./Endpoint');

const printBlankLine = () => console.log();

/*
  I'm against monolithic code like this file, but splitting it induces unneeded complexity.
*/
class Offline {

  constructor(serverless, options) {
    this.serverless = serverless;
    this.service = serverless.service;
    this.serverlessLog = serverless.cli.log.bind(serverless.cli);
    this.options = options;
    this.provider = 'aws';
    this.beforeStart = this.beforeStart.bind(this);
    this.start = this.start.bind(this);

    this.commands = {
      offline: {
        usage: 'Simulates API Gateway to call your lambda functions offline.',
        lifecycleEvents: ['start'],
        // add start nested options
        commands: {
          start: {
            usage: 'Simulates API Gateway to call your lambda functions offline using backward compatible initialization.',
            lifecycleEvents: [
              'init',
            ],
          },
        },
        options: {
          prefix: {
            usage: 'Adds a prefix to every path, to send your requests to http://localhost:3000/prefix/[your_path] instead.',
            shortcut: 'p',
          },
          host: {
            usage: 'The host name to listen on. Default: localhost',
            shortcut: 'o',
          },
          port: {
            usage: 'Port to listen on. Default: 3000',
            shortcut: 'P',
          },
          stage: {
            usage: 'The stage used to populate your templates.',
            shortcut: 's',
          },
          region: {
            usage: 'The region used to populate your templates.',
            shortcut: 'r',
          },
          skipCacheInvalidation: {
            usage: 'Tells the plugin to skip require cache invalidation. A script reloading tool like Nodemon might then be needed',
            shortcut: 'c',
          },
          httpsProtocol: {
            usage: 'To enable HTTPS, specify directory (relative to your cwd, typically your project dir) for both cert.pem and key.pem files.',
            shortcut: 'H',
          },
          noTimeout: {
            usage: 'Disable the timeout feature.',
            shortcut: 't',
          },
          dontPrintOutput: {
            usage: 'Turns of logging of your lambda outputs in the terminal.',
          },
          corsAllowOrigin: {
            usage: 'Used to build the Access-Control-Allow-Origin header for CORS support.',
          },
          corsAllowHeaders: {
            usage: 'Used to build the Access-Control-Allow-Headers header for CORS support.',
          },
          corsDisallowCredentials: {
            usage: 'Used to override the Access-Control-Allow-Credentials default (which is true) to false.',
          },
        },
      },
    };

    this.hooks = {
      'before:offline:start:init': this.beforeStart,
      'offline:start:init': this.start,
      'before:offline:start': this.beforeStart,
      'offline:start': this.start,
    };
  }

  logPluginIssue() {
    this.serverlessLog('If you think this is an issue with the plugin please submit it, thanks!');
    this.serverlessLog('https://github.com/dherault/serverless-offline/issues');
  }

  beforeStart() {
  }

  // Entry point for the plugin (sls offline)
  start() {
    const version = this.serverless.version;

    if (!version.startsWith('1.')) {
      this.serverlessLog(`Offline requires Serverless v1.x.x but found ${version}. Exiting.`);
      process.exit(0);
    }

    // Internals
    process.env.IS_OFFLINE = true; // Some users would like to know their environment outside of the handler
    this.requests = {};            // Maps a request id to the request's state (done: bool, timeout: timer)

    // Methods
    this._setOptions();     // Will create meaningful options from cli options
    this._registerBabel();  // Support for ES6
    this._createServer();   // Hapijs boot
    this._createRoutes();   // API  Gateway emulation
    this._create404Route(); // Not found handling
    return this._listen();         // Hapijs listen
  }

  _setOptions() {

    // Applies defaults
    this.options = {
      host: this.options.host || 'localhost',
      port: this.options.port || 3000,
      prefix: this.options.prefix || '/',
      stage: this.service.provider.stage,
      region: this.service.provider.region,
      noTimeout: this.options.noTimeout || false,
      dontPrintOutput: this.options.dontPrintOutput || false,
      httpsProtocol: this.options.httpsProtocol || '',
      skipCacheInvalidation: this.options.skipCacheInvalidation || false,
      corsAllowOrigin: this.options.corsAllowOrigin || '*',
      corsAllowHeaders: this.options.corsAllowHeaders || 'accept,content-type,x-api-key',
      corsAllowCredentials: true,
    };

    // Prefix must start and end with '/'
    if (!this.options.prefix.startsWith('/')) this.options.prefix = `/${this.options.prefix}`;
    if (!this.options.prefix.endsWith('/')) this.options.prefix += '/';

    this.globalBabelOptions = ((this.service.custom || {})['serverless-offline'] || {}).babelOptions;

    this.velocityContextOptions = {
      stageVariables: {}, // this.service.environment.stages[this.options.stage].vars,
      stage: this.options.stage,
    };

    // Parse CORS options
    this.options.corsAllowOrigin = this.options.corsAllowOrigin.replace(/\s/g, '').split(',');
    this.options.corsAllowHeaders = this.options.corsAllowHeaders.replace(/\s/g, '').split(',');

    if (this.options.corsDisallowCredentials) this.options.corsAllowCredentials = false;

    this.options.corsConfig = {
      origin: this.options.corsAllowOrigin,
      headers: this.options.corsAllowHeaders,
      credentials: this.options.corsAllowCredentials,
    };

    this.serverlessLog(`Starting Offline: ${this.options.stage}/${this.options.region}.`);
    debugLog('options:', this.options);
    debugLog('globalBabelOptions:', this.globalBabelOptions);
  }

  _registerBabel(isBabelRuntime, babelRuntimeOptions) {

    const options = isBabelRuntime ?
      babelRuntimeOptions || { presets: ['es2015'] } :
      this.globalBabelOptions;

    if (options) {
      debugLog('Setting babel register:', options);

      // We invoke babel-register only once
      if (!this.babelRegister) {
        debugLog('For the first time');
        this.babelRegister = require('babel-register')(options);
      }
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

    const connectionOptions = {
      host: this.options.host,
      port: this.options.port,
    };
    const httpsDir = this.options.httpsProtocol;

    // HTTPS support
    if (typeof httpsDir === 'string' && httpsDir.length > 0) {
      connectionOptions.tls = {
        key: fs.readFileSync(path.resolve(httpsDir, 'key.pem'), 'ascii'),
        cert: fs.readFileSync(path.resolve(httpsDir, 'cert.pem'), 'ascii'),
      };
    }

    // Passes the configuration object to the server
    this.server.connection(connectionOptions);
  }

  _createRoutes() {
    const defaultContentType = 'application/json';
    const serviceRuntime = this.service.provider.runtime;

    if (['nodejs', 'nodejs4.3', 'babel'].indexOf(serviceRuntime) === -1) {
      printBlankLine();
      this.serverlessLog(`Warning: found unsupported runtime '${serviceRuntime}'`);
      return;
    }

    Object.keys(this.service.functions).forEach(key => {

      const fun = this.service.getFunction(key);
      const funName = key;
      const funOptions = functionHelper.getFunctionOptions(fun, key, this.serverless.config.servicePath);

      printBlankLine();
      debugLog(funName, 'runtime', serviceRuntime, funOptions.babelOptions || '');
      this.serverlessLog(`Routes for ${funName}:`);

      // Adds a route for each http endpoint
      fun.events.forEach(event => {

        if (!event.http) return;

        // Handle Simple http setup, ex. - http: GET users/index
        if (typeof event.http === 'string') {
          const split = event.http.split(' ');
          event.http = {
            path: split[1],
            method: split[0],
          };
        }

        // generate an enpoint via the endpoint class
        const endpoint = new Endpoint(event.http, funOptions).generate();

        let firstCall = true;

        const integration = endpoint.integration || 'lambda-proxy';
        const epath = endpoint.path;
        const method = endpoint.method.toUpperCase();
        const requestTemplates = endpoint.requestTemplates;

        // Prefix must start and end with '/' BUT path must not end with '/'
        let fullPath = this.options.prefix + (epath.startsWith('/') ? epath.slice(1) : epath);
        if (fullPath !== '/' && fullPath.endsWith('/')) fullPath = path.slice(0, -1);

        this.serverlessLog(`${method} ${fullPath}`);

        // If the endpoint has an authorization function, create an authStrategy for the route
        let authStrategyName = null;

        if (endpoint.authorizer) {
          let authFunctionName = endpoint.authorizer;
          if (typeof endpoint.authorizer === 'object') {
            if (endpoint.authorizer.arn) {
              this.serverlessLog(`WARNING: Serverless Offline does not support non local authorizers: ${endpoint.authorizer.arn}`);

              return;
            }
            authFunctionName = endpoint.authorizer.name;
          }

          this.serverlessLog(`Configuring Authorization: ${endpoint.path} ${authFunctionName}`);

          const authFunction = this.service.getFunction(authFunctionName);

          if (!authFunction) return this.serverlessLog(`WARNING: Authorization function ${authFunctionName} does not exist`);

          let authorizerOptions = {};
          if (typeof endpoint.authorizer === 'string') {
            // serverless 1.x will create default values, so we will to
            authorizerOptions.name = authFunctionName;
            authorizerOptions.type = 'TOKEN';
            authorizerOptions.resultTtlInSeconds = '300';
            authorizerOptions.identitySource = 'method.request.header.Authorization';
          }
          else {
            authorizerOptions = endpoint.authorizer;
          }

          // Create a unique scheme per endpoint
          // This allows the methodArn on the event property to be set appropriately
          const authKey = `${funName}-${authFunctionName}-${method}-${epath}`;
          const authSchemeName = `scheme-${authKey}`;
          authStrategyName = `strategy-${authKey}`; // set strategy name for the route config

          debugLog(`Creating Authorization scheme for ${authKey}`);

          // Create the Auth Scheme for the endpoint
          const scheme = createAuthScheme(
            authFunction,
            authorizerOptions,
            funName,
            epath,
            this.options,
            this.serverlessLog,
            this.serverless.config.servicePath
          );

          // Set the auth scheme and strategy on the server
          this.server.auth.scheme(authSchemeName, scheme);
          this.server.auth.strategy(authStrategyName, authSchemeName);
        }

        // Route creation
        this.server.route({
          method,
          path: fullPath,
          config: {
            cors: this.options.corsConfig,
            auth: authStrategyName,
          },
          handler: (request, reply) => { // Here we go

            printBlankLine();
            this.serverlessLog(`${method} ${request.path} (λ: ${funName})`);
            if (firstCall) {
              this.serverlessLog('The first request might take a few extra seconds');
              firstCall = false;
            }

            // Shared mutable state is the root of all evil they say
            const requestId = Math.random().toString().slice(2);
            this.requests[requestId] = { done: false };
            this.currentRequestId = requestId;

            // Holds the response to do async op
            const response = reply.response().hold();
            const contentType = request.mime || defaultContentType;

            // default request template to '' if we don't have a definition pushed in from serverless or endpoint
            const requestTemplate = typeof requestTemplates !== 'undefined' && integration === 'lambda' ? requestTemplates[contentType] : '';

            const contentTypesThatRequirePayloadParsing = ['application/json', 'application/vnd.api+json'];

            if (contentTypesThatRequirePayloadParsing.indexOf(contentType) !== -1) {
              try {
                request.payload = JSON.parse(request.payload);
              } catch (err) {
                 debugLog('error in converting request.payload to JSON:', err);
              }
            }

            debugLog('requestId:', requestId);
            debugLog('contentType:', contentType);
            debugLog('requestTemplate:', requestTemplate);
            debugLog('payload:', request.payload);

            /* HANDLER LAZY LOADING */

            let handler; // The lambda function

            try {
              handler = functionHelper.createHandler(funOptions, this.options);
            } catch (err) {
              return this._reply500(response, `Error while loading ${funName}`, err, requestId);
            }

            /* REQUEST TEMPLATE PROCESSING (event population) */

            let event = {};

            if (integration === 'lambda') {
              if (requestTemplate) {
                try {
                  debugLog('_____ REQUEST TEMPLATE PROCESSING _____');
                  // Velocity templating language parsing
                  const velocityContext = createVelocityContext(request, this.velocityContextOptions, request.payload || {});
                  event = renderVelocityTemplateObject(requestTemplate, velocityContext);
                } catch (err) {
                  return this._reply500(response, `Error while parsing template "${contentType}" for ${funName}`, err, requestId);
                }
              } else if (typeof request.payload === 'object') {
                event = request.payload || {};
              }
            } else if (integration === 'lambda-proxy') {
              event = createLambdaProxyContext(request, this.options, this.velocityContextOptions.stageVariables);
            }

            event.isOffline = true;

            if (this.serverless.service.custom && this.serverless.service.custom.stageVariables) {
              event.stageVariables = this.serverless.service.custom.stageVariables;
            } else {
              event.stageVariables = {};
            }

            debugLog('event:', event);

            // We create the context, its callback (context.done/succeed/fail) will send the HTTP response
            const lambdaContext = createLambdaContext(fun, (err, data) => {
              // Everything in this block happens once the lambda function has resolved
              debugLog('_____ HANDLER RESOLVED _____');

              debugLog('data:', data)

              // Timeout clearing if needed
              if (this._clearTimeout(requestId)) return;

              // User should not call context.done twice
              if (this.requests[requestId].done) {
                printBlankLine();
                this.serverlessLog(`Warning: context.done called twice within handler '${funName}'!`);
                debugLog('requestId:', requestId);
                return;
              }

              this.requests[requestId].done = true;

              let result = data;
              let responseName = 'default';
              const responseContentType = endpoint.responseContentType;

              /* RESPONSE SELECTION (among endpoint's possible responses) */

              // Failure handling
              if (err) {

                const errorMessage = (err.message || err).toString();

                // Mocks Lambda errors
                result = {
                  errorMessage,
                  errorType: err.constructor.name,
                  stackTrace: this._getArrayStackTrace(err.stack),
                };

                this.serverlessLog(`Failure: ${errorMessage}`);
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
                        this.serverlessLog(`Warning: while processing responseParameter "${key}": "${value}"`);
                        this.serverlessLog(`Offline plugin only supports "integration.response.body[.JSON_path]" right-hand responseParameter. Found "${value}" instead. Skipping.`);
                        this.logPluginIssue();
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
                    this.serverlessLog(`Warning: while processing responseParameter "${key}": "${value}"`);
                    this.serverlessLog(`Offline plugin only supports "method.response.header.PARAM_NAME" left-hand responseParameter. Found "${key}" instead. Skipping.`);
                    this.logPluginIssue();
                    printBlankLine();
                  }
                });
              }

              let statusCode = 200;
              if (integration === 'lambda') {
                /* RESPONSE TEMPLATE PROCCESSING */

                // If there is a responseTemplate, we apply it to the result
                const responseTemplates = chosenResponse.responseTemplates;

                if (isPlainObject(responseTemplates)) {

                  const responseTemplatesKeys = Object.keys(responseTemplates);

                  if (responseTemplatesKeys.length) {

                    // BAD IMPLEMENTATION: first key in responseTemplates
                    const responseTemplate = responseTemplates[responseContentType];

                    if (responseTemplate) {

                      debugLog('_____ RESPONSE TEMPLATE PROCCESSING _____');
                      debugLog(`Using responseTemplate '${responseContentType}'`);

                      try {
                        const reponseContext = createVelocityContext(request, this.velocityContextOptions, result);
                        result = renderVelocityTemplateObject({ root: responseTemplate }, reponseContext).root;
                      }
                      catch (error) {
                        this.serverlessLog(`Error while parsing responseTemplate '${responseContentType}' for lambda ${funName}:`);
                        console.log(error.stack);
                      }
                    }
                  }
                }

              /* HAPIJS RESPONSE CONFIGURATION */

                statusCode = chosenResponse.statusCode || 200;
              if (!chosenResponse.statusCode) {
                printBlankLine();
                this.serverlessLog(`Warning: No statusCode found for response "${responseName}".`);
              }

              response.header('Content-Type', responseContentType, {
                override: false, // Maybe a responseParameter set it already. See #34
              });
              response.statusCode = statusCode;
              response.source = result;

              } else {

                /* HAPIJS RESPONSE CONFIGURATION */

                statusCode = result.statusCode || 200;
                if (!result.statusCode) {
                  printBlankLine();
                  this.serverlessLog(`Warning: No statusCode found for response "${responseName}".`);
                }

                Object.keys(result.headers)
                  .forEach(header =>
                    response.header(header, result.headers[header], {
                      override: false, // Maybe a responseParameter set it already. See #34
                    })
                );

                response.header('Content-Type', responseContentType, {
                  override: false, // Maybe a responseParameter set it already. See #34
                });

                response.statusCode = statusCode;
                response.source = result.body;
              }

              // Log response
              let whatToLog = result;

              try {
                whatToLog = JSON.stringify(result);
              }
              catch (error) {
                // nothing
              }
              finally {
                if (!this.options.dontPrintOutput) this.serverlessLog(err ? `Replying ${statusCode}` : `[${statusCode}] ${whatToLog}`);
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
              if (serviceRuntime === 'babel' && !this.requests[requestId].done) {
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
    return new Promise((resolve, reject) => {
    this.server.start(err => {
        if (err) return reject(err);

      printBlankLine();
      this.serverlessLog(`Offline listening on http${this.options.httpsProtocol ? 's' : ''}://${this.options.host}:${this.options.port}`);

        resolve(this.server);
    });
    });
  }

  // Bad news
  _reply500(response, message, err, requestId) {

    if (this._clearTimeout(requestId)) return;

    this.requests[requestId].done = true;

    const stackTrace = this._getArrayStackTrace(err.stack);

    this.serverlessLog(message);
    console.log(stackTrace || err);

    /* eslint-disable no-param-reassign */
    response.statusCode = 200; // APIG replies 200 by default on failures
    response.source = {
      errorMessage: message,
      errorType: err.constructor.name,
      stackTrace,
      offlineInfo: 'If you believe this is an issue with the plugin please submit it, thanks. https://github.com/dherault/serverless-offline/issues',
    };
    /* eslint-enable no-param-reassign */
    this.serverlessLog('Replying error in handler');
    response.send();
  }

  _replyTimeout(response, funName, funTimeout, requestId) {
    if (this.currentRequestId !== requestId) return;

    this.requests[requestId].done = true;

    this.serverlessLog(`Replying timeout after ${funTimeout}ms`);
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
      method: '*',
      path: '/{p*}',
      config: { cors: this.options.corsConfig },
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
}

module.exports = Offline;
