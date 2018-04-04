'use strict';

// Node dependencies
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

// External dependencies
const Hapi = require('hapi');
const corsHeaders = require('hapi-cors-headers');
const _ = require('lodash');
const crypto = require('crypto');

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
const parseResources = require('./parseResources');

/*
 I'm against monolithic code like this file, but splitting it induces unneeded complexity.
 */
class Offline {

  constructor(serverless, options) {
    this.serverless = serverless;
    this.service = serverless.service;
    this.serverlessLog = serverless.cli.log.bind(serverless.cli);
    this.options = options;
    this.exitCode = 0;
    this.provider = 'aws';
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
              'end',
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
          location: {
            usage: 'The root location of the handlers\' files.',
            shortcut: 'l',
          },
          noTimeout: {
            usage: 'Disable the timeout feature.',
            shortcut: 't',
          },
          noEnvironment: {
            usage: 'Turns off loading of your environment variables from serverless.yml. Allows the usage of tools such as PM2 or docker-compose.',
          },
          resourceRoutes: {
            usage: 'Turns on loading of your HTTP proxy settings from serverless.yml.',
          },
          dontPrintOutput: {
            usage: 'Turns off logging of your lambda outputs in the terminal.',
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
          apiKey: {
            usage: 'Defines the api key value to be used for endpoints marked as private. Defaults to a random hash.',
          },
          exec: {
            usage: 'When provided, a shell script is executed when the server starts up, and the server will shut down after handling this command.',
          },
          noAuth: {
            usage: 'Turns off all authorizers',
          },
        },
      },
    };

    this.hooks = {
      'offline:start:init': this.start.bind(this),
      'offline:start': this.start.bind(this),
      'offline:start:end': this.end.bind(this),
    };
  }

  printBlankLine() {
    console.log();
  }

  logPluginIssue() {
    this.serverlessLog('If you think this is an issue with the plugin please submit it, thanks!');
    this.serverlessLog('https://github.com/dherault/serverless-offline/issues');
  }

  // Entry point for the plugin (sls offline)
  start() {
    this._checkVersion();

    // Some users would like to know their environment outside of the handler
    process.env.IS_OFFLINE = true;

    return Promise.resolve(this._buildServer())
    .then(() => this._listen())
    .then(() => this.options.exec ? this._executeShellScript() : this._listenForSigInt())
    .then(() => this.end());
  }

  _checkVersion() {
    const version = this.serverless.version;
    if (!version.startsWith('1.')) {
      this.serverlessLog(`Offline requires Serverless v1.x.x but found ${version}. Exiting.`);
      process.exit(0);
    }
  }

  _listenForSigInt() {
    // Listen for ctrl+c to stop the server
    return new Promise(resolve => {
      process.on('SIGINT', () => {
        this.serverlessLog('Offline Halting...');
        resolve();
      });
    });
  }

  _executeShellScript() {
    const command = this.options.exec;

    this.serverlessLog(`Offline executing script [${command}]`);

    return new Promise(resolve => {
      exec(command, (error, stdout, stderr) => {
        this.serverlessLog(`exec stdout: [${stdout}]`);
        this.serverlessLog(`exec stderr: [${stderr}]`);
        if (error) {
          // Use the failed command's exit code, proceed as normal so that shutdown can occur gracefully
          this.serverlessLog(`Offline error executing script [${error}]`);
          this.exitCode = error.code || 1;
        }
        resolve();
      });
    });
  }

  _buildServer() {
    // Maps a request id to the request's state (done: bool, timeout: timer)
    this.requests = {};

    // Methods
    this._setOptions();     // Will create meaningful options from cli options
    this._storeOriginalEnvironment(); // stores the original process.env for assigning upon invoking the handlers
    this._registerBabel();  // Support for ES6
    this._createServer();   // Hapijs boot
    this._createRoutes();   // API  Gateway emulation
    this._createResourceRoutes(); // HTTP Proxy defined in Resource
    this._create404Route(); // Not found handling

    return this.server;
  }

  _storeOriginalEnvironment() {
    this.originalEnvironment = _.extend({}, process.env);
  }

  _setOptions() {
    // Merge the different sources of values for this.options
    // Precedence is: command line options, YAML options, defaults.

    const defaultOpts = {
      host: 'localhost',
      location: '.',
      port: 3000,
      prefix: '/',
      stage: this.service.provider.stage,
      region: this.service.provider.region,
      noTimeout: false,
      noEnvironment: false,
      resourceRoutes: false,
      dontPrintOutput: false,
      httpsProtocol: '',
      skipCacheInvalidation: false,
      noAuth: false,
      corsAllowOrigin: '*',
      corsAllowHeaders: 'accept,content-type,x-api-key',
      corsAllowCredentials: true,
      apiKey: crypto.createHash('md5').digest('hex'),
    };

    this.options = _.merge({}, defaultOpts, (this.service.custom || {})['serverless-offline'], this.options);

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

    this.server.register(require('h2o2'), err => err && this.serverlessLog(err));

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

    // Enable CORS preflight response
    this.server.ext('onPreResponse', corsHeaders);
  }

  _createRoutes() {
    const defaultContentType = 'application/json';
    const serviceRuntime = this.service.provider.runtime;
    const apiKeys = this.service.provider.apiKeys;
    const protectedRoutes = [];

    if (['nodejs', 'nodejs4.3', 'nodejs6.10', 'nodejs8.10', 'babel'].indexOf(serviceRuntime) === -1) {
      this.printBlankLine();
      this.serverlessLog(`Warning: found unsupported runtime '${serviceRuntime}'`);

      return;
    }

    // for simple API Key authentication model
    if (!_.isEmpty(apiKeys)) {
      this.serverlessLog(`Key with token: ${this.options.apiKey}`);
      this.serverlessLog('Remember to use x-api-key on the request headers');
    }

    Object.keys(this.service.functions).forEach(key => {

      const fun = this.service.getFunction(key);
      const funName = key;
      const servicePath = path.join(this.serverless.config.servicePath, this.options.location);
      const funOptions = functionHelper.getFunctionOptions(fun, key, servicePath);
      debugLog(`funOptions ${JSON.stringify(funOptions, null, 2)} `);

      this.printBlankLine();
      debugLog(funName, 'runtime', serviceRuntime, funOptions.babelOptions || '');
      this.serverlessLog(`Routes for ${funName}:`);

      // Adds a route for each http endpoint
      (fun.events && fun.events.length || this.serverlessLog('(none)')) && fun.events.forEach(event => {
        if (!event.http) return this.serverlessLog('(none)');

        // Handle Simple http setup, ex. - http: GET users/index
        if (typeof event.http === 'string') {
          const split = event.http.split(' ');
          event.http = {
            path: split[1],
            method: split[0],
          };
        }

        if (_.eq(event.http.private, true)) {
          protectedRoutes.push(`${event.http.method.toUpperCase()}#/${event.http.path}`);
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
        if (fullPath !== '/' && fullPath.endsWith('/')) fullPath = fullPath.slice(0, -1);
        fullPath = fullPath.replace(/\+}/g, '*}');

        this.serverlessLog(`${method} ${fullPath}`);

        // If the endpoint has an authorization function, create an authStrategy for the route
        const authStrategyName = this.options.noAuth ? null : this._configureAuthorization(endpoint, funName, method, epath, servicePath);

        let cors = null;
        if (endpoint.cors) {
          cors = {
            origin: endpoint.cors.origins || this.options.corsConfig.origin,
            headers: endpoint.cors.headers || this.options.corsConfig.headers,
            credentials: endpoint.cors.credentials || this.options.corsConfig.credentials,
          };
        }

        // Route creation
        const routeMethod = method === 'ANY' ? '*' : method;
        const routeConfig = {
          cors,
          auth: authStrategyName,
          timeout: { socket: false },
        };

        if (routeMethod !== 'HEAD' && routeMethod !== 'GET') {
          // maxBytes: Increase request size from 1MB default limit to 10MB.
          // Cf AWS API GW payload limits.
          routeConfig.payload = { parse: false, maxBytes: 1024 * 1024 * 10 };
        }

        this.server.route({
          method: routeMethod,
          path: fullPath,
          config: routeConfig,
          handler: (request, reply) => { // Here we go
            // Payload processing
            request.payload = request.payload && request.payload.toString();
            request.rawPayload = request.payload;

            // Headers processing
            // Hapi lowercases the headers whereas AWS does not
            // so we recreate a custom headers object from the raw request
            const headersArray = request.raw.req.rawHeaders;

            // During tests, `server.inject` uses *shot*, a package
            // for performing injections that does not entirely mimick
            // Hapi's usual request object. rawHeaders are then missing
            // Hence the fallback for testing

            // Normal usage
            if (headersArray) {
              const unprocessedHeaders = {};

              for (let i = 0; i < headersArray.length; i += 2) {
                unprocessedHeaders[headersArray[i]] = headersArray[i + 1];
              }

              request.unprocessedHeaders = unprocessedHeaders;
            }
            // Lib testing
            else {
              request.unprocessedHeaders = request.headers;
              // console.log('request.unprocessedHeaders:', request.unprocessedHeaders);
            }


            // Incomming request message
            this.printBlankLine();
            this.serverlessLog(`${method} ${request.path} (λ: ${funName})`);
            if (firstCall) {
              this.serverlessLog('The first request might take a few extra seconds');
              firstCall = false;
            }

            // this.serverlessLog(protectedRoutes);
            // Check for APIKey
            if (_.includes(protectedRoutes, `${routeMethod}#${fullPath}`) || _.includes(protectedRoutes, `ANY#${fullPath}`)) {
              const errorResponse = response => response({ message: 'Forbidden' }).code(403).type('application/json').header('x-amzn-ErrorType', 'ForbiddenException');
              if ('x-api-key' in request.headers) {
                const requestToken = request.headers['x-api-key'];
                if (requestToken !== this.options.apiKey) {
                  debugLog(`Method ${method} of function ${funName} token ${requestToken} not valid`);

                  return errorResponse(reply);
                }
              }
              else {
                debugLog(`Missing x-api-key on private function ${funName}`);

                return errorResponse(reply);
              }
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

            // https://hapijs.com/api#route-configuration doesn't seem to support selectively parsing
            // so we have to do it ourselves
            const contentTypesThatRequirePayloadParsing = ['application/json', 'application/vnd.api+json'];
            if (contentTypesThatRequirePayloadParsing.indexOf(contentType) !== -1) {
              try {
                request.payload = JSON.parse(request.payload);
              }
              catch (err) {
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
              if (this.options.noEnvironment) {
                // This evict errors in server when we use aws services like ssm
                const baseEnvironment = {
                  AWS_ACCESS_KEY_ID: 'dev',
                  AWS_SECRET_ACCESS_KEY: 'dev',
                  AWS_REGION: 'dev'
                }
                process.env = _.extend({}, baseEnvironment);
              }
              else {
                Object.assign(process.env, this.service.provider.environment, this.service.functions[key].environment);
              }
              Object.assign(process.env, this.originalEnvironment);
              handler = functionHelper.createHandler(funOptions, this.options);
            }
            catch (err) {
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
                }
                catch (err) {
                  return this._reply500(response, `Error while parsing template "${contentType}" for ${funName}`, err, requestId);
                }
              }
              else if (typeof request.payload === 'object') {
                event = request.payload || {};
              }
            }
            else if (integration === 'lambda-proxy') {
              event = createLambdaProxyContext(request, this.options, this.velocityContextOptions.stageVariables);
            }

            event.isOffline = true;

            if (this.serverless.service.custom && this.serverless.service.custom.stageVariables) {
              event.stageVariables = this.serverless.service.custom.stageVariables;
            }
            else if (integration !== 'lambda-proxy') {
              event.stageVariables = {};
            }

            debugLog('event:', event);

            // We create the context, its callback (context.done/succeed/fail) will send the HTTP response
            const lambdaContext = createLambdaContext(fun, (err, data) => {
              // Everything in this block happens once the lambda function has resolved
              debugLog('_____ HANDLER RESOLVED _____');

              // Timeout clearing if needed
              if (this._clearTimeout(requestId)) return;

              // User should not call context.done twice
              if (this.requests[requestId].done) {
                this.printBlankLine();
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
              let errorStatusCode = 0;
              if (err) {

                const errorMessage = (err.message || err).toString();

                const re = /\[(\d{3})]/;
                const found = errorMessage.match(re);
                if (found && found.length > 1) {
                  errorStatusCode = found[1];
                }
                else {
                  errorStatusCode = '500';
                }

                // Mocks Lambda errors
                result = {
                  errorMessage,
                  errorType: err.constructor.name,
                  stackTrace: this._getArrayStackTrace(err.stack),
                };

                this.serverlessLog(`Failure: ${errorMessage}`);
                if (result.stackTrace) {
                  debugLog(result.stackTrace.join('\n  '));
                }

                for (const key in endpoint.responses) {
                  if (key !== 'default' && errorMessage.match(`^${endpoint.responses[key].selectionPattern || key}$`)) {
                    responseName = key;
                    break;
                  }
                }
              }

              debugLog(`Using response '${responseName}'`);
              const chosenResponse = endpoint.responses[responseName];

              /* RESPONSE PARAMETERS PROCCESSING */

              const responseParameters = chosenResponse.responseParameters;

              if (_.isPlainObject(responseParameters)) {

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

                      }
                      else {
                        this.printBlankLine();
                        this.serverlessLog(`Warning: while processing responseParameter "${key}": "${value}"`);
                        this.serverlessLog(`Offline plugin only supports "integration.response.body[.JSON_path]" right-hand responseParameter. Found "${value}" instead. Skipping.`);
                        this.logPluginIssue();
                        this.printBlankLine();
                      }
                    }
                    else {
                      headerValue = value.match(/^'.*'$/) ? value.slice(1, -1) : value; // See #34
                    }
                    // Applies the header;
                    debugLog(`Will assign "${headerValue}" to header "${headerName}"`);
                    response.header(headerName, headerValue);

                  }
                  else {
                    this.printBlankLine();
                    this.serverlessLog(`Warning: while processing responseParameter "${key}": "${value}"`);
                    this.serverlessLog(`Offline plugin only supports "method.response.header.PARAM_NAME" left-hand responseParameter. Found "${key}" instead. Skipping.`);
                    this.logPluginIssue();
                    this.printBlankLine();
                  }
                });
              }

              let statusCode = 200;

              if (integration === 'lambda') {
                /* RESPONSE TEMPLATE PROCCESSING */
                // If there is a responseTemplate, we apply it to the result
                const responseTemplates = chosenResponse.responseTemplates;

                if (_.isPlainObject(responseTemplates)) {

                  const responseTemplatesKeys = Object.keys(responseTemplates);

                  if (responseTemplatesKeys.length) {

                    // BAD IMPLEMENTATION: first key in responseTemplates
                    const responseTemplate = responseTemplates[responseContentType];

                    if (responseTemplate && responseTemplate !== '\n') {

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

                statusCode = errorStatusCode !== 0 ? errorStatusCode : (chosenResponse.statusCode || 200);

                if (!chosenResponse.statusCode) {
                  this.printBlankLine();
                  this.serverlessLog(`Warning: No statusCode found for response "${responseName}".`);
                }

                response.header('Content-Type', responseContentType, {
                  override: false, // Maybe a responseParameter set it already. See #34
                });
                response.statusCode = statusCode;
                response.source = result;
              }
              else if (integration === 'lambda-proxy') {
                response.statusCode = statusCode = result.statusCode || 200;

                const defaultHeaders = { 'Content-Type': 'application/json' };

                Object.assign(response.headers, defaultHeaders, result.headers);
                if (!_.isUndefined(result.body)) {
                  if (result.isBase64Encoded) {
                    response.encoding = 'binary';
                    response.source = new Buffer(result.body, 'base64');
                    response.variety = 'buffer';
                  }
                  else {
                    response.source = result.body;
                  }
                }
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

  _configureAuthorization(endpoint, funName, method, epath, servicePath) {
    let authStrategyName = null;
    if (endpoint.authorizer) {
      let authFunctionName = endpoint.authorizer;
      if (typeof authFunctionName === 'string' && authFunctionName.toUpperCase() === 'AWS_IAM') {
        this.serverlessLog('WARNING: Serverless Offline does not support the AWS_IAM authorization type');

        return null;
      }
      if (typeof endpoint.authorizer === 'object') {
        if (endpoint.authorizer.type && endpoint.authorizer.type.toUpperCase() === 'AWS_IAM') {
          this.serverlessLog('WARNING: Serverless Offline does not support the AWS_IAM authorization type');

          return null;
        }
        if (endpoint.authorizer.arn) {
          this.serverlessLog(`WARNING: Serverless Offline does not support non local authorizers: ${endpoint.authorizer.arn}`);

          return authStrategyName;
        }
        authFunctionName = endpoint.authorizer.name;
      }

      this.serverlessLog(`Configuring Authorization: ${endpoint.path} ${authFunctionName}`);

      const authFunction = this.service.getFunction(authFunctionName);

      if (!authFunction) return this.serverlessLog(`WARNING: Authorization function ${authFunctionName} does not exist`);

      const authorizerOptions = {
        resultTtlInSeconds: '300',
        identitySource: 'method.request.header.Authorization',
      };

      if (typeof endpoint.authorizer === 'string') {
        authorizerOptions.name = authFunctionName;
      }
      else {
        Object.assign(authorizerOptions, endpoint.authorizer);
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
        servicePath,
        this.serverless
      );

      // Set the auth scheme and strategy on the server
      this.server.auth.scheme(authSchemeName, scheme);
      this.server.auth.strategy(authStrategyName, authSchemeName);
    }

    return authStrategyName;
  }

  // All done, we can listen to incomming requests
  _listen() {
    return new Promise((resolve, reject) => {
      this.server.start(err => {
        if (err) return reject(err);

        this.printBlankLine();
        this.serverlessLog(`Offline listening on http${this.options.httpsProtocol ? 's' : ''}://${this.options.host}:${this.options.port}`);

        resolve(this.server);
      });
    });
  }

  end() {
    this.serverlessLog('Halting offline server');
    this.server.stop({ timeout: 5000 })
    .then(() => process.exit(this.exitCode));
  }

  // Bad news
  _reply500(response, message, err, requestId) {

    if (this._clearTimeout(requestId)) return;

    this.requests[requestId].done = true;

    const stackTrace = this._getArrayStackTrace(err.stack);

    this.serverlessLog(message);
    if (stackTrace && stackTrace.length > 0) {
      console.log(stackTrace);
    }
    else {
      console.log(err);
    }

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

  _createResourceRoutes() {
    if (!this.options.resourceRoutes) return true;
    const resourceRoutesOptions = this.options.resourceRoutes;
    const resourceRoutes = parseResources(this.service.resources);

    if (_.isEmpty(resourceRoutes)) return true;

    this.printBlankLine();
    this.serverlessLog('Routes defined in resources:');

    Object.keys(resourceRoutes).forEach(methodId => {
      const resourceRoutesObj = resourceRoutes[methodId];
      const path = resourceRoutesObj.path;
      const method = resourceRoutesObj.method;
      const isProxy = resourceRoutesObj.isProxy;
      const proxyUri = resourceRoutesObj.proxyUri;
      const pathResource = resourceRoutesObj.pathResource;

      if (!isProxy) {
        return this.serverlessLog(`WARNING: Only HTTP_PROXY is supported. Path '${pathResource}' is ignored.`);
      }
      if (`${method}`.toUpperCase() !== 'GET') {
        return this.serverlessLog(`WARNING: ${method} proxy is not supported. Path '${pathResource}' is ignored.`);
      }
      if (!path) {
        return this.serverlessLog(`WARNING: Could not resolve path for '${methodId}'.`);
      }

      const proxyUriOverwrite = resourceRoutesOptions[methodId] || {};
      const proxyUriInUse = proxyUriOverwrite.Uri || proxyUri;

      if (!proxyUriInUse) {
        return this.serverlessLog(`WARNING: Could not load Proxy Uri for '${methodId}'`);
      }

      this.serverlessLog(`${method} ${pathResource} -> ${proxyUriInUse}`);

      this.server.route({
        method,
        path,
        config: { cors: this.options.corsConfig },
        handler: (request, reply) => {
          const params = request.params;
          let resultUri = proxyUriInUse;

          Object.keys(params).forEach(key => {
            resultUri = resultUri.replace(`{${key}}`, params[key]);
          });

          reply.proxy({ uri: resultUri });
        },
      });
    });
  }

  _create404Route() {
    // If a {proxy+} route exists, don't conflict with it
    if (this.server.match('*', '/{p*}')) return;

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

// Serverless exits with code 1 when a promise rejection is unhandled. Not AWS.
// Users can still use their own unhandledRejection event though.
process.removeAllListeners('unhandledRejection');

module.exports = Offline;
