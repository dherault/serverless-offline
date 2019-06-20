'use strict';

// Node dependencies
const fs = require('fs');
const path = require('path');
const { performance, PerformanceObserver } = require('perf_hooks');
const { exec } = require('child_process');

// External dependencies
const hapi = require('@hapi/hapi');
const h2o2 = require('@hapi/h2o2');

// Internal lib
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
const { createDefaultApiKey, detectEncoding, randomId } = require('./utils');
const authFunctionNameExtractor = require('./authFunctionNameExtractor');
const requestBodyValidator = require('./requestBodyValidator');

/*
  I'm against monolithic code like this file
  but splitting it induces unneeded complexity.
*/
class Offline {

  constructor(serverless, options) {
    this.serverless = serverless;
    this.service = serverless.service;
    this.serverlessLog = serverless.cli.log.bind(serverless.cli);
    this.options = options;
    this.exitCode = 0;

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
          apiKey: {
            usage: 'Defines the API key value to be used for endpoints marked as private. Defaults to a random hash.',
          },
          binPath: {
            usage: 'Path to the Serverless binary.',
            shortcut: 'b',
          },
          cacheInvalidationRegex: {
            usage: 'Provide the plugin with a regexp to use for cache invalidation. Default: node_modules',
          },
          corsAllowHeaders: {
            usage: 'Used to build the Access-Control-Allow-Headers header for CORS support.',
          },
          corsAllowOrigin: {
            usage: 'Used to build the Access-Control-Allow-Origin header for CORS support.',
          },
          corsDisallowCredentials: {
            usage: 'Used to override the Access-Control-Allow-Credentials default (which is true) to false.',
          },
          corsExposedHeaders: {
            usage: 'USed to build the Access-Control-Exposed-Headers response header for CORS support',
          },
          disableCookieValidation: {
            usage: 'Used to disable cookie-validation on hapi.js-server',
          },
          disableModelValidation: {
            usage: 'Disables the Model Validator',
          },
          enforceSecureCookies: {
            usage: 'Enforce secure cookies',
          },
          exec: {
            usage: 'When provided, a shell script is executed when the server starts up, and the server will shut down after handling this command.',
          },
          host: {
            usage: 'The host name to listen on. Default: localhost',
            shortcut: 'o',
          },
          httpsProtocol: {
            usage: 'To enable HTTPS, specify directory (relative to your cwd, typically your project dir) for both cert.pem and key.pem files.',
            shortcut: 'H',
          },
          location: {
            usage: 'The root location of the handlers\' files.',
            shortcut: 'l',
          },
          noAuth: {
            usage: 'Turns off all authorizers',
          },
          noEnvironment: {
            usage: 'Turns off loading of your environment variables from serverless.yml. Allows the usage of tools such as PM2 or docker-compose.',
          },
          port: {
            usage: 'Port to listen on. Default: 3000',
            shortcut: 'P',
          },
          prefix: {
            usage: 'Adds a prefix to every path, to send your requests to http://localhost:3000/prefix/[your_path] instead.',
            shortcut: 'p',
          },
          preserveTrailingSlash: {
            usage: 'Used to keep trailing slashes on the request path',
          },
          printOutput: {
            usage: 'Outputs your lambda response to the terminal.',
          },
          providedRuntime: {
            usage: 'Sets the provided runtime for lambdas',
          },
          region: {
            usage: 'The region used to populate your templates.',
            shortcut: 'r',
          },
          resourceRoutes: {
            usage: 'Turns on loading of your HTTP proxy settings from serverless.yml.',
          },
          showDuration: {
            usage: 'Show the execution time duration of the lambda function.',
          },
          skipCacheInvalidation: {
            usage: 'Tells the plugin to skip require cache invalidation. A script reloading tool like Nodemon might then be needed',
            shortcut: 'c',
          },
          stage: {
            usage: 'The stage used to populate your templates.',
            shortcut: 's',
          },
          useSeparateProcesses: {
            usage: 'Uses separate node processes for handlers',
          },
        },
      },
    };

    this.hooks = {
      'offline:start:init': this.start.bind(this),
      'offline:start': this.startWithExplicitEnd.bind(this),
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

  // Entry point for the plugin (sls offline) when running 'sls offline start'
  start() {
    this._checkVersion();

    // Some users would like to know their environment outside of the handler
    process.env.IS_OFFLINE = true;

    return Promise.resolve(this._buildServer())
      .then(() => this._listen())
      .then(() => this.options.exec ? this._executeShellScript() : this._listenForTermination());
  }

  /**
   * Entry point for the plugin (sls offline) when running 'sls offline'
   * The call to this.end() would terminate the process before 'offline:start:end' could be consumed
   * by downstream plugins. When running sls offline that can be expected, but docs say that
   * 'sls offline start' will provide the init and end hooks for other plugins to consume
   * */
  startWithExplicitEnd() {
    return this.start().then(() => this.end());
  }

  _checkVersion() {
    const { version } = this.serverless;

    if (!version.startsWith('1.')) {
      this.serverlessLog(`Offline requires Serverless v1.x.x but found ${version}. Exiting.`);
      process.exit(0);
    }
  }

  _listenForTermination() {
    // SIGINT will be usually sent when user presses ctrl+c
    const waitForSigInt = new Promise(resolve => {
      process.on('SIGINT', () => resolve('SIGINT'));
    });

    // SIGTERM is a default termination signal in many cases,
    // for example when "killing" a subprocess spawned in node
    // with child_process methods
    const waitForSigTerm = new Promise(resolve => {
      process.on('SIGTERM', () => resolve('SIGTERM'));
    });

    return Promise.race([waitForSigInt, waitForSigTerm]).then(command => {
      this.serverlessLog(`Got ${command} signal. Offline Halting...`);
    });
  }

  _executeShellScript() {
    const command = this.options.exec;
    const options = { env: Object.assign({ IS_OFFLINE: true }, this.service.provider.environment, this.originalEnvironment) };

    this.serverlessLog(`Offline executing script [${command}]`);

    return new Promise(resolve => {
      exec(command, options, (error, stdout, stderr) => {
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
    this.lastRequestOptions = null;

    // Methods
    this._setOptions(); // Will create meaningful options from cli options
    this._storeOriginalEnvironment(); // stores the original process.env for assigning upon invoking the handlers
    this._createServer(); // Hapijs boot
    this._createRoutes(); // API  Gateway emulation
    this._createResourceRoutes(); // HTTP Proxy defined in Resource
    this._create404Route(); // Not found handling

    return this.server;
  }

  _storeOriginalEnvironment() {
    this.originalEnvironment = Object.assign({}, process.env);
  }

  _setOptions() {
    // Merge the different sources of values for this.options
    // Precedence is: command line options, YAML options, defaults.
    const defaultOptions = {
      apiKey: createDefaultApiKey(),
      cacheInvalidationRegex: 'node_modules',
      corsAllowOrigin: '*',
      corsAllowCredentials: true,
      corsAllowHeaders: 'accept,content-type,x-api-key,authorization',
      corsExposedHeaders: 'WWW-Authenticate,Server-Authorization',
      disableCookieValidation: false,
      disableModelValidation: false,
      enforceSecureCookies: false,
      exec: '',
      host: 'localhost',
      httpsProtocol: '',
      location: '.',
      noAuth: false,
      noEnvironment: false,
      noTimeout: false,
      port: 3000,
      prefix: '/',
      preserveTrailingSlash: false,
      printOutput: false,
      providedRuntime: '',
      showDuration: false,
      stage: this.service.provider.stage,
      region: this.service.provider.region,
      resourceRoutes: false,
      skipCacheInvalidation: false,
      useSeparateProcesses: false,
    };

    // In the constructor, stage and regions are set to undefined
    if (this.options.stage === undefined) delete this.options.stage;
    if (this.options.region === undefined) delete this.options.region;

    const yamlOptions = (this.service.custom || {})['serverless-offline'];
    this.options = Object.assign({}, defaultOptions, yamlOptions, this.options);

    // Prefix must start and end with '/'
    if (!this.options.prefix.startsWith('/')) this.options.prefix = `/${this.options.prefix}`;
    if (!this.options.prefix.endsWith('/')) this.options.prefix += '/';

    this.velocityContextOptions = {
      stageVariables: {}, // this.service.environment.stages[this.options.stage].vars,
      stage: this.options.stage,
    };

    // Parse CORS options
    this.options.corsAllowOrigin = this.options.corsAllowOrigin.replace(/\s/g, '').split(',');
    this.options.corsAllowHeaders = this.options.corsAllowHeaders.replace(/\s/g, '').split(',');
    this.options.corsExposedHeaders = this.options.corsExposedHeaders.replace(/\s/g, '').split(',');

    if (this.options.corsDisallowCredentials) this.options.corsAllowCredentials = false;

    this.options.corsConfig = {
      origin: this.options.corsAllowOrigin,
      headers: this.options.corsAllowHeaders,
      credentials: this.options.corsAllowCredentials,
      exposedHeaders: this.options.corsExposedHeaders,
    };

    this.options.cacheInvalidationRegex = new RegExp(this.options.cacheInvalidationRegex);

    this.serverlessLog(`Starting Offline: ${this.options.stage}/${this.options.region}.`);
    debugLog('options:', this.options);
  }

  _createServer() {
    const serverOptions = {
      host: this.options.host,
      port: this.options.port,
      router: {
        stripTrailingSlash: !this.options.preserveTrailingSlash, // removes trailing slashes on incoming paths.
      },
    };

    const httpsDir = this.options.httpsProtocol;

    // HTTPS support
    if (typeof httpsDir === 'string' && httpsDir.length > 0) {
      serverOptions.tls = {
        key: fs.readFileSync(path.resolve(httpsDir, 'key.pem'), 'ascii'),
        cert: fs.readFileSync(path.resolve(httpsDir, 'cert.pem'), 'ascii'),
      };
    }

    serverOptions.state = this.options.enforceSecureCookies ? {
      isHttpOnly: true,
      isSecure: true,
      isSameSite: false,
    } : {
      isHttpOnly: false,
      isSecure: false,
      isSameSite: false,
    };

    // Hapijs server creation
    this.server = hapi.server(serverOptions);

    this.server.register(h2o2).catch(err => err && this.serverlessLog(err));

    // Enable CORS preflight response
    this.server.ext('onPreResponse', (request, h) => {
      if (request.headers.origin) {
        const response = request.response.isBoom ? request.response.output : request.response;

        response.headers['access-control-allow-origin'] = request.headers.origin;
        response.headers['access-control-allow-credentials'] = 'true';

        if (request.method === 'options') {
          response.statusCode = 200;
          response.headers['access-control-expose-headers'] = 'content-type, content-length, etag';
          response.headers['access-control-max-age'] = 60 * 10;

          if (request.headers['access-control-request-headers']) {
            response.headers['access-control-allow-headers'] = request.headers['access-control-request-headers'];
          }

          if (request.headers['access-control-request-method']) {
            response.headers['access-control-allow-methods'] = request.headers['access-control-request-method'];
          }
        }
      }

      return h.continue;
    });
  }

  _createRoutes() {
    let serviceRuntime = this.service.provider.runtime;
    const defaultContentType = 'application/json';
    const apiKeys = this.service.provider.apiKeys;
    const protectedRoutes = [];

    if (!serviceRuntime) {
      throw new Error('Missing required property "runtime" for provider.');
    }

    if (typeof serviceRuntime !== 'string') {
      throw new Error('Provider configuration property "runtime" wasn\'t a string.');
    }

    if (serviceRuntime === 'provided') {
      if (this.options.providedRuntime) {
        serviceRuntime = this.options.providedRuntime;
      }
      else {
        throw new Error('Runtime "provided" is unsupported. Please add a --providedRuntime CLI option.');
      }
    }

    if (!(serviceRuntime.startsWith('nodejs') || serviceRuntime.startsWith('python') || serviceRuntime.startsWith('ruby'))) {
      this.printBlankLine();
      this.serverlessLog(`Warning: found unsupported runtime '${serviceRuntime}'`);

      return;
    }

    // for simple API Key authentication model
    if (apiKeys) {
      this.serverlessLog(`Key with token: ${this.options.apiKey}`);

      if (this.options.noAuth) {
        this.serverlessLog('Authorizers are turned off. You do not need to use x-api-key header.');
      }
      else {
        this.serverlessLog('Remember to use x-api-key on the request headers');
      }
    }

    Object.keys(this.service.functions).forEach(key => {

      const fun = this.service.getFunction(key);
      const funName = key;
      const servicePath = path.join(this.serverless.config.servicePath, this.options.location);
      const funOptions = functionHelper.getFunctionOptions(fun, key, servicePath, serviceRuntime);

      debugLog(`funOptions ${JSON.stringify(funOptions, null, 2)} `);
      this.printBlankLine();
      debugLog(funName, 'runtime', serviceRuntime);
      this.serverlessLog(`Routes for ${funName}:`);

      if (!fun.events) {
        fun.events = [];
      }

      // Add proxy for lamda invoke
      fun.events.push({
        http: {
          method: 'POST',
          path: `{apiVersion}/functions/${fun.name}/invocations`,
          integration: 'lambda',
          request: {
            template: {
              // AWS SDK for NodeJS specifies as 'binary/octet-stream' not 'application/json'
              'binary/octet-stream': '$input.body',
            },
          },
          response: {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        },
      });
      // Adds a route for each http endpoint
      fun.events.forEach(event => {
        if (!event.http) return;

        // Handle Simple http setup, ex. - http: GET users/index
        if (typeof event.http === 'string') {
          const [method, path] = event.http.split(' ');
          event.http = { method, path };
        }

        // generate an enpoint via the endpoint class
        const endpoint = new Endpoint(event.http, funOptions).generate();

        const integration = endpoint.integration || 'lambda-proxy';
        const requestBodyValidationModel = (['lambda', 'lambda-proxy'].includes(integration)
          ? requestBodyValidator.getModel(this.service.custom, event.http, this.serverlessLog)
          : null);
        const epath = endpoint.path;
        const method = endpoint.method.toUpperCase();
        const requestTemplates = endpoint.requestTemplates;

        // Prefix must start and end with '/' BUT path must not end with '/'
        let fullPath = this.options.prefix + (epath.startsWith('/') ? epath.slice(1) : epath);
        if (fullPath !== '/' && fullPath.endsWith('/')) fullPath = fullPath.slice(0, -1);
        fullPath = fullPath.replace(/\+}/g, '*}');

        if (event.http.private) {
          protectedRoutes.push(`${method}#${fullPath}`);
        }

        this.serverlessLog(`${method} ${fullPath}${requestBodyValidationModel && !this.options.disableModelValidation ? ` - request body will be validated against ${requestBodyValidationModel.name}` : ''}`);

        // If the endpoint has an authorization function, create an authStrategy for the route
        const authStrategyName = this.options.noAuth ? null : this._configureAuthorization(endpoint, funName, method, epath, servicePath, serviceRuntime);

        let cors = null;
        if (endpoint.cors) {
          cors = {
            origin: endpoint.cors.origins || this.options.corsConfig.origin,
            headers: endpoint.cors.headers || this.options.corsConfig.headers,
            credentials: endpoint.cors.credentials || this.options.corsConfig.credentials,
            exposedHeaders: this.options.corsConfig.exposedHeaders,
          };
        }

        // Route creation
        const routeMethod = method === 'ANY' ? '*' : method;

        const state = this.options.disableCookieValidation ? {
          parse: false,
          failAction: 'ignore',
        } : {
          parse: true,
          failAction: 'error',
        };

        const routeConfig = {
          cors,
          auth: authStrategyName,
          timeout: { socket: false },
          state,
        };

        // skip HEAD routes as hapi will fail with 'Method name not allowed: HEAD ...'
        // for more details, check https://github.com/dherault/serverless-offline/issues/204
        if (routeMethod === 'HEAD') {
          this.serverlessLog('HEAD method event detected. Skipping HAPI server route mapping ...');

          return;
        }

        if (routeMethod !== 'HEAD' && routeMethod !== 'GET') {
          // maxBytes: Increase request size from 1MB default limit to 10MB.
          // Cf AWS API GW payload limits.
          routeConfig.payload = { parse: false, maxBytes: 1024 * 1024 * 10 };
        }

        this.server.route({
          method: routeMethod,
          path: fullPath,
          config: routeConfig,
          handler: (request, h) => { // Here we go
            // Store current request as the last one
            this.lastRequestOptions = {
              method: request.method,
              url: request.url.href,
              headers: request.headers,
              payload: request.payload,
            };

            if (request.auth.credentials && request.auth.strategy) {
              this.lastRequestOptions.auth = request.auth;
            }

            // Payload processing
            const encoding = detectEncoding(request);

            request.payload = request.payload && request.payload.toString(encoding);
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
              request.unprocessedHeaders = {};
              request.multiValueHeaders = {};

              for (let i = 0; i < headersArray.length; i += 2) {
                request.unprocessedHeaders[headersArray[i]] = headersArray[i + 1];
                request.multiValueHeaders[headersArray[i]] = (request.multiValueHeaders[headersArray[i]] || []).concat(headersArray[i + 1]);
              }
            }
            // Lib testing
            else {
              request.unprocessedHeaders = request.headers;
            }

            // Incomming request message
            this.printBlankLine();
            this.serverlessLog(`${method} ${request.path} (λ: ${funName})`);

            // Check for APIKey
            if ((protectedRoutes.includes(`${routeMethod}#${fullPath}`) || protectedRoutes.includes(`ANY#${fullPath}`)) && !this.options.noAuth) {
              const errorResponse = () => h.response({ message: 'Forbidden' }).code(403).type('application/json').header('x-amzn-ErrorType', 'ForbiddenException');

              if ('x-api-key' in request.headers) {
                const requestToken = request.headers['x-api-key'];
                if (requestToken !== this.options.apiKey) {
                  debugLog(`Method ${method} of function ${funName} token ${requestToken} not valid`);

                  return errorResponse();
                }
              }
              else if (request.auth && request.auth.credentials && 'usageIdentifierKey' in request.auth.credentials) {
                const usageIdentifierKey = request.auth.credentials.usageIdentifierKey;
                if (usageIdentifierKey !== this.options.apiKey) {
                  debugLog(`Method ${method} of function ${funName} token ${usageIdentifierKey} not valid`);

                  return errorResponse();
                }
              }
              else {
                debugLog(`Missing x-api-key on private function ${funName}`);

                return errorResponse();
              }
            }
            // Shared mutable state is the root of all evil they say
            const requestId = randomId();
            this.requests[requestId] = { done: false };
            this.currentRequestId = requestId;

            const response = h.response();
            const contentType = request.mime || defaultContentType;

            // default request template to '' if we don't have a definition pushed in from serverless or endpoint
            const requestTemplate = typeof requestTemplates !== 'undefined' && integration === 'lambda' ? requestTemplates[contentType] : '';

            // https://hapijs.com/api#route-configuration doesn't seem to support selectively parsing
            // so we have to do it ourselves
            const contentTypesThatRequirePayloadParsing = ['application/json', 'application/vnd.api+json'];
            if (contentTypesThatRequirePayloadParsing.includes(contentType) && request.payload && request.payload.length > 1) {
              try {
                if (!request.payload || request.payload.length < 1) {
                  request.payload = '{}';
                }

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

            let userHandler; // The lambda function
            Object.assign(process.env, this.originalEnvironment);

            try {
              if (this.options.noEnvironment) {
                // This evict errors in server when we use aws services like ssm
                const baseEnvironment = {
                  AWS_REGION: 'dev',
                };
                if (!process.env.AWS_PROFILE) {
                  baseEnvironment.AWS_ACCESS_KEY_ID = 'dev';
                  baseEnvironment.AWS_SECRET_ACCESS_KEY = 'dev';
                }

                process.env = Object.assign(baseEnvironment, process.env);
              }
              else {
                Object.assign(
                  process.env,
                  { AWS_REGION: this.service.provider.region },
                  this.service.provider.environment,
                  this.service.functions[key].environment
                );
              }
              process.env._HANDLER = fun.handler;
              userHandler = functionHelper.createHandler(funOptions, this.options);
            }
            catch (err) {
              return this._reply500(response, `Error while loading ${funName}`, err);
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
                  return this._reply500(response, `Error while parsing template "${contentType}" for ${funName}`, err);
                }
              }
              else if (typeof request.payload === 'object') {
                event = request.payload || {};
              }
            }
            else if (integration === 'lambda-proxy') {
              event = createLambdaProxyContext(request, this.options, this.velocityContextOptions.stageVariables);
            }

            if (event && typeof event === 'object') {
              event.isOffline = true;

              if (this.service.custom && this.service.custom.stageVariables) {
                event.stageVariables = this.service.custom.stageVariables;
              }
              else if (integration !== 'lambda-proxy') {
                event.stageVariables = {};
              }
            }

            debugLog('event:', event);

            return new Promise(resolve => {
              // We create the context, its callback (context.done/succeed/fail) will send the HTTP response
              const lambdaContext = createLambdaContext(fun, this.service.provider, (err, data, fromPromise) => {
                // Everything in this block happens once the lambda function has resolved
                debugLog('_____ HANDLER RESOLVED _____');

                // User should not call context.done twice
                if (!this.requests[requestId] || this.requests[requestId].done) {
                  this.printBlankLine();
                  const warning = fromPromise
                    ? `Warning: handler '${funName}' returned a promise and also uses a callback!\nThis is problematic and might cause issues in your lambda.`
                    : `Warning: context.done called twice within handler '${funName}'!`;
                  this.serverlessLog(warning);
                  debugLog('requestId:', requestId);

                  return;
                }

                this.requests[requestId].done = true;

                let result = data;
                let responseName = 'default';
                const { contentHandling, responseContentType } = endpoint;

                /* RESPONSE SELECTION (among endpoint's possible responses) */

                // Failure handling
                let errorStatusCode = 0;
                if (err) {
                  // Since the --useSeparateProcesses option loads the handler in
                  // a separate process and serverless-offline communicates with it
                  // over IPC, we are unable to catch JavaScript unhandledException errors
                  // when the handler code contains bad JavaScript. Instead, we "catch"
                  // it here and reply in the same way that we would have above when
                  // we lazy-load the non-IPC handler function.
                  if (this.options.useSeparateProcesses && err.ipcException) {
                    return resolve(this._reply500(response, `Error while loading ${funName}`, err));
                  }

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

                if (responseParameters) {

                  const responseParametersKeys = Object.keys(responseParameters);

                  debugLog('_____ RESPONSE PARAMETERS PROCCESSING _____');
                  debugLog(`Found ${responseParametersKeys.length} responseParameters for '${responseName}' response`);

                  // responseParameters use the following shape: "key": "value"
                  Object.entries(responseParametersKeys).forEach(([key, value]) => {

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

                  const endpointResponseHeaders = (endpoint.response && endpoint.response.headers) || {};

                  Object.entries(endpointResponseHeaders)
                    .filter(([, value]) => typeof value === 'string' && /^'.*?'$/.test(value))
                    .forEach(([key, value]) => response.header(key, value.slice(1, -1)));

                  /* LAMBDA INTEGRATION RESPONSE TEMPLATE PROCCESSING */

                  // If there is a responseTemplate, we apply it to the result
                  const { responseTemplates } = chosenResponse;

                  if (typeof responseTemplates === 'object') {
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

                  /* LAMBDA INTEGRATION HAPIJS RESPONSE CONFIGURATION */

                  statusCode = errorStatusCode !== 0 ? errorStatusCode : (chosenResponse.statusCode || 200);

                  if (!chosenResponse.statusCode) {
                    this.printBlankLine();
                    this.serverlessLog(`Warning: No statusCode found for response "${responseName}".`);
                  }

                  response.header('Content-Type', responseContentType, {
                    override: false, // Maybe a responseParameter set it already. See #34
                  });

                  response.statusCode = statusCode;

                  if (contentHandling === 'CONVERT_TO_BINARY') {
                    response.encoding = 'binary';
                    response.source = Buffer.from(result, 'base64');
                    response.variety = 'buffer';
                  }
                  else {
                    if (result && result.body && typeof result.body !== 'string') {
                      return this._reply500(response, 'According to the API Gateway specs, the body content must be stringified. Check your Lambda response and make sure you are invoking JSON.stringify(YOUR_CONTENT) on your body object', {});
                    }
                    response.source = result;
                  }
                }
                else if (integration === 'lambda-proxy') {

                  /* LAMBDA PROXY INTEGRATION HAPIJS RESPONSE CONFIGURATION */

                  response.statusCode = statusCode = result.statusCode || 200;

                  const headers = {};
                  if (result.headers) {
                    Object.keys(result.headers).forEach(header => {
                      headers[header] = (headers[header] || []).concat(result.headers[header]);
                    });
                  }
                  if (result.multiValueHeaders) {
                    Object.keys(result.multiValueHeaders).forEach(header => {
                      headers[header] = (headers[header] || []).concat(result.multiValueHeaders[header]);
                    });
                  }

                  debugLog('headers', headers);

                  Object.keys(headers).forEach(header => {
                    if (header.toLowerCase() === 'set-cookie') {
                      headers[header].forEach(headerValue => {
                        const cookieName = headerValue.slice(0, headerValue.indexOf('='));
                        const cookieValue = headerValue.slice(headerValue.indexOf('=') + 1);
                        h.state(cookieName, cookieValue, { encoding: 'none', strictHeader: false });
                      });
                    }
                    else {
                      headers[header].forEach(headerValue => {
                        // it looks like Hapi doesn't support multiple headers with the same name,
                        // appending values is the closest we can come to the AWS behavior.
                        response.header(header, headerValue, { append: true });
                      });
                    }
                  });

                  response.header('Content-Type', 'application/json', { override: false, duplicate: false });

                  if (typeof result.body !== 'undefined') {
                    if (result.isBase64Encoded) {
                      response.encoding = 'binary';
                      response.source = Buffer.from(result.body, 'base64');
                      response.variety = 'buffer';
                    }
                    else {
                      if (result.body && typeof result.body !== 'string') {
                        return this._reply500(response, 'According to the API Gateway specs, the body content must be stringified. Check your Lambda response and make sure you are invoking JSON.stringify(YOUR_CONTENT) on your body object', {});
                      }
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
                  if (this.options.printOutput) this.serverlessLog(err ? `Replying ${statusCode}` : `[${statusCode}] ${whatToLog}`);
                  debugLog('requestId:', requestId);
                }

                // Bon voyage!
                resolve(response);
              });

              // Now we are outside of createLambdaContext, so this happens before the handler gets called:

              // We cannot use Hapijs's timeout feature because the logic above can take a significant time, so we implement it ourselves
              this.requests[requestId].timeout = this.options.noTimeout ? null : setTimeout(
                this._replyTimeout.bind(this, response, resolve, funName, funOptions.funTimeout, requestId),
                funOptions.funTimeout
              );

              // If request body validation is enabled, validate body against the request model.
              if (requestBodyValidationModel && !this.options.disableModelValidation) {
                try {
                  requestBodyValidator.validate(requestBodyValidationModel, event.body);
                }
                catch (error) {
                  // When request body validation fails, APIG will return back 400 as detailed in:
                  // https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-method-request-validation.html
                  return resolve(this._replyError(400, response, `Invalid request body for '${funName}' handler`, error));
                }
              }

              // Finally we call the handler
              debugLog('_____ CALLING HANDLER _____');

              const cleanup = () => {
                this._clearTimeout(requestId);
                delete this.requests[requestId];
              };

              let x;

              if (this.options.showDuration) {
                performance.mark(`${requestId}-start`);

                const obs = new PerformanceObserver(list => {
                  for (const entry of list.getEntries()) {
                    this.serverlessLog(`Duration ${entry.duration.toFixed(2)} ms (λ: ${entry.name})`);
                  }

                  obs.disconnect();
                });

                obs.observe({ entryTypes: ['measure'] });
              }

              try {
                x = userHandler(event, lambdaContext, (err, result) => {
                  setTimeout(cleanup, 0);

                  if (this.options.showDuration) {
                    performance.mark(`${requestId}-end`);
                    performance.measure(funName, `${requestId}-start`, `${requestId}-end`);
                  }

                  return lambdaContext.done(err, result);
                });

                // Promise support
                if (!this.requests[requestId].done) {
                  if (x && typeof x.then === 'function') {
                    x.then(lambdaContext.succeed).catch(lambdaContext.fail).then(cleanup, cleanup);
                  }
                  else if (x instanceof Error) {
                    lambdaContext.fail(x);
                  }
                }
              }
              catch (error) {
                cleanup();

                return resolve(this._reply500(response, `Uncaught error in your '${funName}' handler`, error));
              }
            });
          },
        });
      });
    });
  }

  _extractAuthFunctionName(endpoint) {
    const result = authFunctionNameExtractor(endpoint, this.serverlessLog);

    return result.unsupportedAuth ? null : result.authorizerName;
  }

  _configureAuthorization(endpoint, funName, method, epath, servicePath, serviceRuntime) {
    if (!endpoint.authorizer) {
      return null;
    }

    const authFunctionName = this._extractAuthFunctionName(endpoint);

    if (!authFunctionName) {
      return null;
    }

    this.serverlessLog(`Configuring Authorization: ${endpoint.path} ${authFunctionName}`);

    const authFunction = this.service.getFunction(authFunctionName);

    if (!authFunction) return this.serverlessLog(`WARNING: Authorization function ${authFunctionName} does not exist`);

    const authorizerOptions = {
      resultTtlInSeconds: '300',
      identitySource: 'method.request.header.Authorization',
      identityValidationExpression: '(.*)',
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
    const authStrategyName = `strategy-${authKey}`; // set strategy name for the route config

    debugLog(`Creating Authorization scheme for ${authKey}`);

    // Create the Auth Scheme for the endpoint
    const scheme = createAuthScheme(
      authFunction,
      authorizerOptions,
      authFunctionName,
      epath,
      this.options,
      this.serverlessLog,
      servicePath,
      serviceRuntime,
      this.serverless
    );

    // Set the auth scheme and strategy on the server
    this.server.auth.scheme(authSchemeName, scheme);
    this.server.auth.strategy(authStrategyName, authSchemeName);

    return authStrategyName;
  }

  // All done, we can listen to incomming requests
  async _listen() {
    try {
      await this.server.start();
    }
    catch (e) {
      console.error('Unexpected error while starting serverless-offline server:', e);
      process.exit(1);
    }

    this.printBlankLine();
    this.serverlessLog(`Offline listening on http${this.options.httpsProtocol ? 's' : ''}://${this.options.host}:${this.options.port}`);
    this.serverlessLog('Enter "rp" to replay the last request');

    process.openStdin().addListener('data', data => {
      // note: data is an object, and when converted to a string it will
      // end with a linefeed.  so we (rather crudely) account for that
      // with toString() and then trim()
      if (data.toString().trim() === 'rp') {
        this._injectLastRequest();
      }
    });

    return this.server;
  }

  end() {
    this.serverlessLog('Halting offline server');
    functionHelper.cleanup();
    this.server.stop({ timeout: 5000 })
      .then(() => process.exit(this.exitCode));
  }

  _injectLastRequest() {
    if (this.lastRequestOptions) {
      this.serverlessLog('Replaying last request');
      this.server.inject(this.lastRequestOptions);
    }
    else {
      this.serverlessLog('No last request to replay!');
    }
  }

  // Bad news
  _replyError(responseCode, response, message, err) {
    const stackTrace = this._getArrayStackTrace(err.stack);

    this.serverlessLog(message);
    if (stackTrace && stackTrace.length > 0) {
      console.log(stackTrace);
    }
    else {
      console.log(err);
    }

    response.header('Content-Type', 'application/json');

    /* eslint-disable no-param-reassign */
    response.statusCode = responseCode;
    response.source = {
      errorMessage: message,
      errorType: err.constructor.name,
      stackTrace,
      offlineInfo: 'If you believe this is an issue with the plugin please submit it, thanks. https://github.com/dherault/serverless-offline/issues',
    };
    /* eslint-enable no-param-reassign */
    this.serverlessLog('Replying error in handler');

    return response;
  }

  _reply500(response, message, err) {
    // APIG replies 200 by default on failures
    return this._replyError(200, response, message, err);
  }

  _replyTimeout(response, resolve, funName, funTimeout, requestId) {
    if (this.currentRequestId !== requestId) return;

    this.serverlessLog(`Replying timeout after ${funTimeout}ms`);
    /* eslint-disable no-param-reassign */
    response.statusCode = 503;
    response.source = `[Serverless-Offline] Your λ handler '${funName}' timed out after ${funTimeout}ms.`;
    /* eslint-enable no-param-reassign */
    resolve(response);
  }

  _clearTimeout(requestId) {
    const { timeout } = this.requests[requestId] || {};
    clearTimeout(timeout);
  }

  _createResourceRoutes() {
    if (!this.options.resourceRoutes) return true;
    const resourceRoutesOptions = this.options.resourceRoutes;
    const resourceRoutes = parseResources(this.service.resources);

    if (!resourceRoutes || !Object.keys(resourceRoutes).length) return true;

    this.printBlankLine();
    this.serverlessLog('Routes defined in resources:');

    Object.entries(resourceRoutes).forEach(([methodId, resourceRoutesObj]) => {
      const { isProxy, method, path, pathResource, proxyUri } = resourceRoutesObj;

      if (!isProxy) {
        return this.serverlessLog(`WARNING: Only HTTP_PROXY is supported. Path '${pathResource}' is ignored.`);
      }
      if (!path) {
        return this.serverlessLog(`WARNING: Could not resolve path for '${methodId}'.`);
      }

      let fullPath = this.options.prefix + (pathResource.startsWith('/') ? pathResource.slice(1) : pathResource);
      if (fullPath !== '/' && fullPath.endsWith('/')) fullPath = fullPath.slice(0, -1);
      fullPath = fullPath.replace(/\+}/g, '*}');

      const proxyUriOverwrite = resourceRoutesOptions[methodId] || {};
      const proxyUriInUse = proxyUriOverwrite.Uri || proxyUri;

      if (!proxyUriInUse) {
        return this.serverlessLog(`WARNING: Could not load Proxy Uri for '${methodId}'`);
      }

      const routeMethod = method === 'ANY' ? '*' : method;
      const routeConfig = { cors: this.options.corsConfig };

      // skip HEAD routes as hapi will fail with 'Method name not allowed: HEAD ...'
      // for more details, check https://github.com/dherault/serverless-offline/issues/204
      if (routeMethod === 'HEAD') {
        this.serverlessLog('HEAD method event detected. Skipping HAPI server route mapping ...');

        return;
      }

      if (routeMethod !== 'HEAD' && routeMethod !== 'GET') {
        routeConfig.payload = { parse: false };
      }

      this.serverlessLog(`${method} ${fullPath} -> ${proxyUriInUse}`);
      this.server.route({
        method: routeMethod,
        path: fullPath,
        config: routeConfig,
        handler: (request, h) => {
          const { params } = request;
          let resultUri = proxyUriInUse;

          Object.entries(params).forEach(([key, value]) => {
            resultUri = resultUri.replace(`{${key}}`, value);
          });

          if (request.url.search !== null) {
            resultUri += request.url.search; // search is empty string by default
          }

          this.serverlessLog(`PROXY ${request.method} ${request.url.path} -> ${resultUri}`);

          return h.proxy({ uri: resultUri, passThrough: true });
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
      handler: (request, h) => {
        const response = h.response({
          statusCode: 404,
          error: 'Serverless-offline: route not found.',
          currentRoute: `${request.method} - ${request.path}`,
          existingRoutes: this.server.table()
            .filter(route => route.path !== '/{p*}') // Exclude this (404) route
            .sort((a, b) => a.path <= b.path ? -1 : 1) // Sort by path
            .map(route => `${route.method} - ${route.path}`), // Human-friendly result
        });
        response.statusCode = 404;

        return response;
      },
    });
  }

  _getArrayStackTrace(stack) {
    if (!stack) return null;

    const splittedStack = stack.split('\n');

    return splittedStack.slice(0, splittedStack.findIndex(item => item.match(/server.route.handler.createLambdaContext/))).map(line => line.trim());
  }

  _logAndExit() {
    // eslint-disable-next-line
    console.log.apply(null, arguments);
    process.exit(0);
  }
}

// Serverless exits with code 1 when a promise rejection is unhandled. Not AWS.
// Users can still use their own unhandledRejection event though.
process.removeAllListeners('unhandledRejection');

module.exports = Offline;
