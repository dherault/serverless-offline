'use strict';

const fs = require('fs');
const path = require('path');
const { performance, PerformanceObserver } = require('perf_hooks');
const hapi = require('@hapi/hapi');
const h2o2 = require('@hapi/h2o2');
const debugLog = require('./debugLog');
const jsonPath = require('./jsonPath');
const LambdaContext = require('./LambdaContext.js');
const createVelocityContext = require('./createVelocityContext');
const createLambdaProxyEvent = require('./createLambdaProxyEvent');
const renderVelocityTemplateObject = require('./renderVelocityTemplateObject');
const createAuthScheme = require('./createAuthScheme');
const functionHelper = require('./functionHelper');
const Endpoint = require('./Endpoint');
const parseResources = require('./parseResources');
const { detectEncoding, createUniqueId } = require('./utils');
const authFunctionNameExtractor = require('./authFunctionNameExtractor');

module.exports = class ApiGateway {
  constructor(serverless, options, velocityContextOptions) {
    this.serverless = serverless;
    this.service = serverless.service;
    this.serverlessLog = serverless.cli.log.bind(serverless.cli);
    this.options = options;
    this.exitCode = 0;

    this.requests = {};
    this.lastRequestOptions = null;
    this.velocityContextOptions = velocityContextOptions;
  }

  printBlankLine() {
    console.log();
  }

  logPluginIssue() {
    this.serverlessLog(
      'If you think this is an issue with the plugin please submit it, thanks!',
    );
    this.serverlessLog('https://github.com/dherault/serverless-offline/issues');
  }

  _createServer() {
    const { host, port } = this.options;

    const serverOptions = {
      host,
      port,
      router: {
        stripTrailingSlash: !this.options.preserveTrailingSlash, // removes trailing slashes on incoming paths.
      },
    };

    const httpsDir = this.options.httpsProtocol;

    // HTTPS support
    if (typeof httpsDir === 'string' && httpsDir.length > 0) {
      serverOptions.tls = {
        cert: fs.readFileSync(path.resolve(httpsDir, 'cert.pem'), 'ascii'),
        key: fs.readFileSync(path.resolve(httpsDir, 'key.pem'), 'ascii'),
      };
    }

    serverOptions.state = this.options.enforceSecureCookies
      ? {
          isHttpOnly: true,
          isSameSite: false,
          isSecure: true,
        }
      : {
          isHttpOnly: false,
          isSameSite: false,
          isSecure: false,
        };

    // Hapijs server creation
    this.server = hapi.server(serverOptions);

    this.server.register(h2o2).catch((err) => err && this.serverlessLog(err));

    // Enable CORS preflight response
    this.server.ext('onPreResponse', (request, h) => {
      if (request.headers.origin) {
        const response = request.response.isBoom
          ? request.response.output
          : request.response;

        response.headers['access-control-allow-origin'] =
          request.headers.origin;
        response.headers['access-control-allow-credentials'] = 'true';

        if (request.method === 'options') {
          response.statusCode = 200;
          response.headers['access-control-expose-headers'] =
            'content-type, content-length, etag';
          response.headers['access-control-max-age'] = 60 * 10;

          if (request.headers['access-control-request-headers']) {
            response.headers['access-control-allow-headers'] =
              request.headers['access-control-request-headers'];
          }

          if (request.headers['access-control-request-method']) {
            response.headers['access-control-allow-methods'] =
              request.headers['access-control-request-method'];
          }
        }
      }

      return h.continue;
    });

    return this.server;
  }

  _extractAuthFunctionName(endpoint) {
    const result = authFunctionNameExtractor(endpoint, this.serverlessLog);

    return result.unsupportedAuth ? null : result.authorizerName;
  }

  _configureAuthorization(
    endpoint,
    funName,
    method,
    epath,
    servicePath,
    serviceRuntime,
  ) {
    if (!endpoint.authorizer) {
      return null;
    }

    const authFunctionName = this._extractAuthFunctionName(endpoint);

    if (!authFunctionName) {
      return null;
    }

    this.serverlessLog(
      `Configuring Authorization: ${endpoint.path} ${authFunctionName}`,
    );

    const authFunction = this.service.getFunction(authFunctionName);

    if (!authFunction)
      return this.serverlessLog(
        `WARNING: Authorization function ${authFunctionName} does not exist`,
      );

    const authorizerOptions = {
      identitySource: 'method.request.header.Authorization',
      identityValidationExpression: '(.*)',
      resultTtlInSeconds: '300',
    };

    if (typeof endpoint.authorizer === 'string') {
      authorizerOptions.name = authFunctionName;
    } else {
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
      this.serverless,
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
    } catch (e) {
      console.error(
        `Unexpected error while starting serverless-offline server on port ${this.options.port}:`,
        e,
      );
      process.exit(1);
    }

    this.printBlankLine();
    this.serverlessLog(
      `Offline [HTTP] listening on http${
        this.options.httpsProtocol ? 's' : ''
      }://${this.options.host}:${this.options.port}`,
    );
    this.serverlessLog('Enter "rp" to replay the last request');

    process.openStdin().addListener('data', (data) => {
      // note: data is an object, and when converted to a string it will
      // end with a linefeed.  so we (rather crudely) account for that
      // with toString() and then trim()
      if (data.toString().trim() === 'rp') {
        this._injectLastRequest();
      }
    });
  }

  _createRoutes(
    event,
    funOptions,
    protectedRoutes,
    funName,
    servicePath,
    serviceRuntime,
    defaultContentType,
    key,
    fun,
  ) {
    // Handle Simple http setup, ex. - http: GET users/index
    if (typeof event.http === 'string') {
      const [method, path] = event.http.split(' ');
      event.http = { method, path };
    }

    // generate an enpoint via the endpoint class
    const endpoint = new Endpoint(event.http, funOptions).generate();

    const integration = endpoint.integration || 'lambda-proxy';
    const epath = endpoint.path;
    const method = endpoint.method.toUpperCase();
    const { requestTemplates } = endpoint;

    // Prefix must start and end with '/' BUT path must not end with '/'
    let fullPath =
      this.options.prefix + (epath.startsWith('/') ? epath.slice(1) : epath);
    if (fullPath !== '/' && fullPath.endsWith('/'))
      fullPath = fullPath.slice(0, -1);
    fullPath = fullPath.replace(/\+}/g, '*}');

    if (event.http.private) {
      protectedRoutes.push(`${method}#${fullPath}`);
    }

    this.serverlessLog(`${method} ${fullPath}`);

    // If the endpoint has an authorization function, create an authStrategy for the route
    const authStrategyName = this.options.noAuth
      ? null
      : this._configureAuthorization(
          endpoint,
          funName,
          method,
          epath,
          servicePath,
          serviceRuntime,
        );

    let cors = null;
    if (endpoint.cors) {
      cors = {
        credentials:
          endpoint.cors.credentials || this.options.corsConfig.credentials,
        exposedHeaders: this.options.corsConfig.exposedHeaders,
        headers: endpoint.cors.headers || this.options.corsConfig.headers,
        origin: endpoint.cors.origins || this.options.corsConfig.origin,
      };
    }

    // Route creation
    const routeMethod = method === 'ANY' ? '*' : method;

    const state = this.options.disableCookieValidation
      ? {
          failAction: 'ignore',
          parse: false,
        }
      : {
          failAction: 'error',
          parse: true,
        };

    const routeConfig = {
      auth: authStrategyName,
      cors,
      state,
      timeout: { socket: false },
    };

    // skip HEAD routes as hapi will fail with 'Method name not allowed: HEAD ...'
    // for more details, check https://github.com/dherault/serverless-offline/issues/204
    if (routeMethod === 'HEAD') {
      this.serverlessLog(
        'HEAD method event detected. Skipping HAPI server route mapping ...',
      );

      return;
    }

    if (routeMethod !== 'HEAD' && routeMethod !== 'GET') {
      // maxBytes: Increase request size from 1MB default limit to 10MB.
      // Cf AWS API GW payload limits.
      routeConfig.payload = { parse: false, maxBytes: 1024 * 1024 * 10 };
    }

    this.server.route({
      config: routeConfig,
      method: routeMethod,
      path: fullPath,
      handler: (request, h) => {
        // Here we go
        // Store current request as the last one
        this.lastRequestOptions = {
          headers: request.headers,
          method: request.method,
          payload: request.payload,
          url: request.url.href,
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
            request.multiValueHeaders[headersArray[i]] = (
              request.multiValueHeaders[headersArray[i]] || []
            ).concat(headersArray[i + 1]);
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
        if (
          (protectedRoutes.includes(`${routeMethod}#${fullPath}`) ||
            protectedRoutes.includes(`ANY#${fullPath}`)) &&
          !this.options.noAuth
        ) {
          const errorResponse = () =>
            h
              .response({ message: 'Forbidden' })
              .code(403)
              .type('application/json')
              .header('x-amzn-ErrorType', 'ForbiddenException');

          if ('x-api-key' in request.headers) {
            const requestToken = request.headers['x-api-key'];
            if (requestToken !== this.options.apiKey) {
              debugLog(
                `Method ${method} of function ${funName} token ${requestToken} not valid`,
              );

              return errorResponse();
            }
          } else if (
            request.auth &&
            request.auth.credentials &&
            'usageIdentifierKey' in request.auth.credentials
          ) {
            const { usageIdentifierKey } = request.auth.credentials;

            if (usageIdentifierKey !== this.options.apiKey) {
              debugLog(
                `Method ${method} of function ${funName} token ${usageIdentifierKey} not valid`,
              );

              return errorResponse();
            }
          } else {
            debugLog(`Missing x-api-key on private function ${funName}`);

            return errorResponse();
          }
        }
        // Shared mutable state is the root of all evil they say
        const requestId = createUniqueId();
        this.requests[requestId] = { done: false };
        this.currentRequestId = requestId;

        const response = h.response();
        const contentType = request.mime || defaultContentType;

        // default request template to '' if we don't have a definition pushed in from serverless or endpoint
        const requestTemplate =
          typeof requestTemplates !== 'undefined' && integration === 'lambda'
            ? requestTemplates[contentType]
            : '';

        // https://hapijs.com/api#route-configuration doesn't seem to support selectively parsing
        // so we have to do it ourselves
        const contentTypesThatRequirePayloadParsing = [
          'application/json',
          'application/vnd.api+json',
        ];

        if (
          contentTypesThatRequirePayloadParsing.includes(contentType) &&
          request.payload &&
          request.payload.length > 1
        ) {
          try {
            if (!request.payload || request.payload.length < 1) {
              request.payload = '{}';
            }

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
          } else {
            Object.assign(
              process.env,
              { AWS_REGION: this.service.provider.region },
              this.service.provider.environment,
              this.service.functions[key].environment,
            );
          }
          process.env._HANDLER = fun.handler;
          userHandler = functionHelper.createHandler(funOptions, this.options);
        } catch (err) {
          return this._reply500(
            response,
            `Error while loading ${funName}`,
            err,
          );
        }

        /* REQUEST TEMPLATE PROCESSING (event population) */

        let event = {};

        if (integration === 'lambda') {
          if (requestTemplate) {
            try {
              debugLog('_____ REQUEST TEMPLATE PROCESSING _____');
              // Velocity templating language parsing
              const velocityContext = createVelocityContext(
                request,
                this.velocityContextOptions,
                request.payload || {},
              );
              event = renderVelocityTemplateObject(
                requestTemplate,
                velocityContext,
              );
            } catch (err) {
              return this._reply500(
                response,
                `Error while parsing template "${contentType}" for ${funName}`,
                err,
              );
            }
          } else if (typeof request.payload === 'object') {
            event = request.payload || {};
          }
        } else if (integration === 'lambda-proxy') {
          event = createLambdaProxyEvent(
            request,
            this.options,
            this.velocityContextOptions.stageVariables,
          );
        }

        event.isOffline = true;

        if (this.service.custom && this.service.custom.stageVariables) {
          event.stageVariables = this.service.custom.stageVariables;
        } else if (integration !== 'lambda-proxy') {
          event.stageVariables = {};
        }

        debugLog('event:', event);

        return new Promise((resolve) => {
          // We create the context, its callback (context.done/succeed/fail) will send the HTTP response
          const lambdaContext = new LambdaContext(
            fun,
            this.service.provider,
            (err, data, fromPromise) => {
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
                  return resolve(
                    this._reply500(
                      response,
                      `Error while loading ${funName}`,
                      err,
                    ),
                  );
                }

                const errorMessage = (err.message || err).toString();

                const re = /\[(\d{3})]/;
                const found = errorMessage.match(re);

                if (found && found.length > 1) {
                  [, errorStatusCode] = found;
                } else {
                  errorStatusCode = '500';
                }

                // Mocks Lambda errors
                result = {
                  errorMessage,
                  errorType: err.constructor.name,
                  stackTrace: this._getArrayStackTrace(err.stack),
                };

                this.serverlessLog(`Failure: ${errorMessage}`);

                if (!this.options.hideStackTraces) {
                  console.error(err.stack);
                }

                for (const key in endpoint.responses) {
                  if (
                    key !== 'default' &&
                    errorMessage.match(
                      `^${endpoint.responses[key].selectionPattern || key}$`,
                    )
                  ) {
                    responseName = key;
                    break;
                  }
                }
              }

              debugLog(`Using response '${responseName}'`);
              const chosenResponse = endpoint.responses[responseName];

              /* RESPONSE PARAMETERS PROCCESSING */

              const { responseParameters } = chosenResponse;

              if (responseParameters) {
                const responseParametersKeys = Object.keys(responseParameters);

                debugLog('_____ RESPONSE PARAMETERS PROCCESSING _____');
                debugLog(
                  `Found ${responseParametersKeys.length} responseParameters for '${responseName}' response`,
                );

                // responseParameters use the following shape: "key": "value"
                Object.entries(responseParameters).forEach(
                  ([key, value]) => {
                    const keyArray = key.split('.'); // eg: "method.response.header.location"
                    const valueArray = value.split('.'); // eg: "integration.response.body.redirect.url"

                    debugLog(
                      `Processing responseParameter "${key}": "${value}"`,
                    );

                    // For now the plugin only supports modifying headers
                    if (
                      key.startsWith('method.response.header') &&
                      keyArray[3]
                    ) {
                      const headerName = keyArray.slice(3).join('.');
                      let headerValue;
                      debugLog('Found header in left-hand:', headerName);

                      if (value.startsWith('integration.response')) {
                        if (valueArray[2] === 'body') {
                          debugLog('Found body in right-hand');
                          headerValue = (valueArray[3]
                            ? jsonPath(result, valueArray.slice(3).join('.'))
                            : result
                          );
                          if(typeof headerValue === 'undefined' || headerValue === null) {
                            headerValue = '';
                          } else {
                            headerValue = headerValue.toString();
                          }
                        } else {
                          this.printBlankLine();
                          this.serverlessLog(
                            `Warning: while processing responseParameter "${key}": "${value}"`,
                          );
                          this.serverlessLog(
                            `Offline plugin only supports "integration.response.body[.JSON_path]" right-hand responseParameter. Found "${value}" instead. Skipping.`,
                          );
                          this.logPluginIssue();
                          this.printBlankLine();
                        }
                      } else {
                        headerValue = value.match(/^'.*'$/)
                          ? value.slice(1, -1)
                          : value; // See #34
                      }
                      // Applies the header;
                      if (headerValue === '') {
                        this.serverlessLog(
                          `Warning: empty value for responseParameter "${key}": "${value}", it won't be set`,
                        );
                      } else {
                        debugLog(
                          `Will assign "${headerValue}" to header "${headerName}"`,
                        );
                        response.header(headerName, headerValue);
                      }
                    } else {
                      this.printBlankLine();
                      this.serverlessLog(
                        `Warning: while processing responseParameter "${key}": "${value}"`,
                      );
                      this.serverlessLog(
                        `Offline plugin only supports "method.response.header.PARAM_NAME" left-hand responseParameter. Found "${key}" instead. Skipping.`,
                      );
                      this.logPluginIssue();
                      this.printBlankLine();
                    }
                  },
                );
              }

              let statusCode = 200;

              if (integration === 'lambda') {
                const endpointResponseHeaders =
                  (endpoint.response && endpoint.response.headers) || {};

                Object.entries(endpointResponseHeaders)
                  .filter(
                    ([, value]) =>
                      typeof value === 'string' && /^'.*?'$/.test(value),
                  )
                  .forEach(([key, value]) =>
                    response.header(key, value.slice(1, -1)),
                  );

                /* LAMBDA INTEGRATION RESPONSE TEMPLATE PROCCESSING */

                // If there is a responseTemplate, we apply it to the result
                const { responseTemplates } = chosenResponse;

                if (typeof responseTemplates === 'object') {
                  const responseTemplatesKeys = Object.keys(responseTemplates);

                  if (responseTemplatesKeys.length) {
                    // BAD IMPLEMENTATION: first key in responseTemplates
                    const responseTemplate =
                      responseTemplates[responseContentType];

                    if (responseTemplate && responseTemplate !== '\n') {
                      debugLog('_____ RESPONSE TEMPLATE PROCCESSING _____');
                      debugLog(
                        `Using responseTemplate '${responseContentType}'`,
                      );

                      try {
                        const reponseContext = createVelocityContext(
                          request,
                          this.velocityContextOptions,
                          result,
                        );
                        result = renderVelocityTemplateObject(
                          { root: responseTemplate },
                          reponseContext,
                        ).root;
                      } catch (error) {
                        this.serverlessLog(
                          `Error while parsing responseTemplate '${responseContentType}' for lambda ${funName}:`,
                        );
                        console.log(error.stack);
                      }
                    }
                  }
                }

                /* LAMBDA INTEGRATION HAPIJS RESPONSE CONFIGURATION */

                statusCode =
                  errorStatusCode !== 0
                    ? errorStatusCode
                    : chosenResponse.statusCode || 200;

                if (!chosenResponse.statusCode) {
                  this.printBlankLine();
                  this.serverlessLog(
                    `Warning: No statusCode found for response "${responseName}".`,
                  );
                }

                response.header('Content-Type', responseContentType, {
                  override: false, // Maybe a responseParameter set it already. See #34
                });

                response.statusCode = statusCode;

                if (contentHandling === 'CONVERT_TO_BINARY') {
                  response.encoding = 'binary';
                  response.source = Buffer.from(result, 'base64');
                  response.variety = 'buffer';
                } else {
                  if (
                    result &&
                    result.body &&
                    typeof result.body !== 'string'
                  ) {
                    return this._reply500(
                      response,
                      'According to the API Gateway specs, the body content must be stringified. Check your Lambda response and make sure you are invoking JSON.stringify(YOUR_CONTENT) on your body object',
                      {},
                    );
                  }
                  response.source = result;
                }
              } else if (integration === 'lambda-proxy') {
                /* LAMBDA PROXY INTEGRATION HAPIJS RESPONSE CONFIGURATION */

                response.statusCode = statusCode =
                  (result || {}).statusCode || 200;

                const headers = {};
                if (result && result.headers) {
                  Object.keys(result.headers).forEach((header) => {
                    headers[header] = (headers[header] || []).concat(
                      result.headers[header],
                    );
                  });
                }
                if (result && result.multiValueHeaders) {
                  Object.keys(result.multiValueHeaders).forEach((header) => {
                    headers[header] = (headers[header] || []).concat(
                      result.multiValueHeaders[header],
                    );
                  });
                }

                debugLog('headers', headers);

                Object.keys(headers).forEach((header) => {
                  if (header.toLowerCase() === 'set-cookie') {
                    headers[header].forEach((headerValue) => {
                      const cookieName = headerValue.slice(
                        0,
                        headerValue.indexOf('='),
                      );
                      const cookieValue = headerValue.slice(
                        headerValue.indexOf('=') + 1,
                      );
                      h.state(cookieName, cookieValue, {
                        encoding: 'none',
                        strictHeader: false,
                      });
                    });
                  } else {
                    headers[header].forEach((headerValue) => {
                      // it looks like Hapi doesn't support multiple headers with the same name,
                      // appending values is the closest we can come to the AWS behavior.
                      response.header(header, headerValue, { append: true });
                    });
                  }
                });

                response.header('Content-Type', 'application/json', {
                  override: false,
                  duplicate: false,
                });

                if (result && typeof result.body !== 'undefined') {
                  if (result.isBase64Encoded) {
                    response.encoding = 'binary';
                    response.source = Buffer.from(result.body, 'base64');
                    response.variety = 'buffer';
                  } else {
                    if (
                      result &&
                      result.body &&
                      typeof result.body !== 'string'
                    ) {
                      return this._reply500(
                        response,
                        'According to the API Gateway specs, the body content must be stringified. Check your Lambda response and make sure you are invoking JSON.stringify(YOUR_CONTENT) on your body object',
                        {},
                      );
                    }
                    response.source = result.body;
                  }
                }
              }

              // Log response
              let whatToLog = result;

              try {
                whatToLog = JSON.stringify(result);
              } catch (error) {
                // nothing
              } finally {
                if (this.options.printOutput)
                  this.serverlessLog(
                    err
                      ? `Replying ${statusCode}`
                      : `[${statusCode}] ${whatToLog}`,
                  );
                debugLog('requestId:', requestId);
              }

              // Bon voyage!
              resolve(response);
            },
          );

          // Now we are outside of new LambdaContext, so this happens before the handler gets called:

          // We cannot use Hapijs's timeout feature because the logic above can take a significant time, so we implement it ourselves
          this.requests[requestId].timeout = this.options.noTimeout
            ? null
            : setTimeout(
                this._replyTimeout.bind(
                  this,
                  response,
                  resolve,
                  funName,
                  funOptions.funTimeout,
                  requestId,
                ),
                funOptions.funTimeout,
              );

          // Finally we call the handler
          debugLog('_____ CALLING HANDLER _____');

          const cleanup = () => {
            this._clearTimeout(requestId);
            delete this.requests[requestId];
          };

          let x;

          if (this.options.showDuration) {
            performance.mark(`${requestId}-start`);

            const obs = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                this.serverlessLog(
                  `Duration ${entry.duration.toFixed(2)} ms (λ: ${entry.name})`,
                );
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
                performance.measure(
                  funName,
                  `${requestId}-start`,
                  `${requestId}-end`,
                );
              }

              return lambdaContext.done(err, result);
            });

            // Promise support
            if (!this.requests[requestId].done) {
              if (x && typeof x.then === 'function') {
                x.then(lambdaContext.succeed)
                  .catch(lambdaContext.fail)
                  .then(cleanup, cleanup);
              } else if (x instanceof Error) {
                lambdaContext.fail(x);
              }
            }
          } catch (error) {
            cleanup();

            return resolve(
              this._reply500(
                response,
                `Uncaught error in your '${funName}' handler`,
                error,
              ),
            );
          }
        });
      },
    });
  }

  // Bad news
  _reply500(response, message, error) {
    this.serverlessLog(message);

    console.error(error);

    response.header('Content-Type', 'application/json');

    /* eslint-disable no-param-reassign */
    response.statusCode = 200; // APIG replies 200 by default on failures;
    response.source = {
      errorMessage: message,
      errorType: error.constructor.name,
      stackTrace: this._getArrayStackTrace(error.stack),
      offlineInfo:
        'If you believe this is an issue with serverless-offline please submit it, thanks. https://github.com/dherault/serverless-offline/issues',
    };
    /* eslint-enable no-param-reassign */

    return response;
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
      const {
        isProxy,
        method,
        path,
        pathResource,
        proxyUri,
      } = resourceRoutesObj;

      if (!isProxy) {
        return this.serverlessLog(
          `WARNING: Only HTTP_PROXY is supported. Path '${pathResource}' is ignored.`,
        );
      }
      if (!path) {
        return this.serverlessLog(
          `WARNING: Could not resolve path for '${methodId}'.`,
        );
      }

      let fullPath =
        this.options.prefix +
        (pathResource.startsWith('/') ? pathResource.slice(1) : pathResource);
      if (fullPath !== '/' && fullPath.endsWith('/'))
        fullPath = fullPath.slice(0, -1);
      fullPath = fullPath.replace(/\+}/g, '*}');

      const proxyUriOverwrite = resourceRoutesOptions[methodId] || {};
      const proxyUriInUse = proxyUriOverwrite.Uri || proxyUri;

      if (!proxyUriInUse) {
        return this.serverlessLog(
          `WARNING: Could not load Proxy Uri for '${methodId}'`,
        );
      }

      const routeMethod = method === 'ANY' ? '*' : method;
      const routeConfig = { cors: this.options.corsConfig };

      // skip HEAD routes as hapi will fail with 'Method name not allowed: HEAD ...'
      // for more details, check https://github.com/dherault/serverless-offline/issues/204
      if (routeMethod === 'HEAD') {
        this.serverlessLog(
          'HEAD method event detected. Skipping HAPI server route mapping ...',
        );

        return;
      }

      if (routeMethod !== 'HEAD' && routeMethod !== 'GET') {
        routeConfig.payload = { parse: false };
      }

      this.serverlessLog(`${method} ${fullPath} -> ${proxyUriInUse}`);
      this.server.route({
        config: routeConfig,
        method: routeMethod,
        path: fullPath,
        handler: (request, h) => {
          const { params } = request;
          let resultUri = proxyUriInUse;

          Object.entries(params).forEach(([key, value]) => {
            resultUri = resultUri.replace(`{${key}}`, value);
          });

          if (request.url.search !== null) {
            resultUri += request.url.search; // search is empty string by default
          }

          this.serverlessLog(
            `PROXY ${request.method} ${request.url.path} -> ${resultUri}`,
          );

          return h.proxy({ uri: resultUri, passThrough: true });
        },
      });
    });
  }

  _create404Route() {
    // If a {proxy+} route exists, don't conflict with it
    if (this.server.match('*', '/{p*}')) return;

    this.server.route({
      config: { cors: this.options.corsConfig },
      method: '*',
      path: '/{p*}',
      handler: (request, h) => {
        const response = h.response({
          statusCode: 404,
          error: 'Serverless-offline: route not found.',
          currentRoute: `${request.method} - ${request.path}`,
          existingRoutes: this.server
            .table()
            .filter((route) => route.path !== '/{p*}') // Exclude this (404) route
            .sort((a, b) => (a.path <= b.path ? -1 : 1)) // Sort by path
            .map((route) => `${route.method} - ${route.path}`), // Human-friendly result
        });
        response.statusCode = 404;

        return response;
      },
    });
  }

  _getArrayStackTrace(stack) {
    if (!stack) return null;

    const splittedStack = stack.split('\n');

    return splittedStack
      .slice(
        0,
        splittedStack.findIndex((item) =>
          item.match(/server.route.handler.LambdaContext/),
        ),
      )
      .map((line) => line.trim());
  }

  _injectLastRequest() {
    if (this.lastRequestOptions) {
      this.serverlessLog('Replaying HTTP last request');
      this.server.inject(this.lastRequestOptions);
    } else {
      this.serverlessLog('No last HTTP request to replay!');
    }
  }
};
