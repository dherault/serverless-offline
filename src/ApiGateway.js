'use strict';

const { readFileSync } = require('fs');
const path = require('path');
const h2o2 = require('@hapi/h2o2');
const { Server } = require('@hapi/hapi');
const authFunctionNameExtractor = require('./authFunctionNameExtractor.js');
const createAuthScheme = require('./createAuthScheme.js');
const createVelocityContext = require('./createVelocityContext.js');
const debugLog = require('./debugLog.js');
const Endpoint = require('./Endpoint.js');
const jsonPath = require('./jsonPath.js');
const LambdaFunction = require('./LambdaFunction.js');
const LambdaProxyEvent = require('./LambdaProxyEvent.js');
const parseResources = require('./parseResources.js');
const renderVelocityTemplateObject = require('./renderVelocityTemplateObject.js');
const { createUniqueId, detectEncoding } = require('./utils/index.js');

const { parse, stringify } = JSON;

module.exports = class ApiGateway {
  constructor(serverless, options, velocityContextOptions) {
    this.service = serverless.service;
    this.log = serverless.cli.log.bind(serverless.cli);
    this.options = options;
    this.lastRequestOptions = null;
    this.velocityContextOptions = velocityContextOptions;

    this._init();
  }

  printBlankLine() {
    if (process.env.NODE_ENV !== 'test') {
      console.log();
    }
  }

  logPluginIssue() {
    this.log(
      'If you think this is an issue with the plugin please submit it, thanks!',
    );
    this.log('https://github.com/dherault/serverless-offline/issues');
  }

  _init() {
    const {
      enforceSecureCookies,
      host,
      httpsProtocol,
      port,
      preserveTrailingSlash,
    } = this.options;

    const serverOptions = {
      host,
      port,
      router: {
        // removes trailing slashes on incoming paths
        stripTrailingSlash: !preserveTrailingSlash,
      },
      state: enforceSecureCookies
        ? {
            isHttpOnly: true,
            isSameSite: false,
            isSecure: true,
          }
        : {
            isHttpOnly: false,
            isSameSite: false,
            isSecure: false,
          },
    };

    // HTTPS support
    if (typeof httpsProtocol === 'string' && httpsProtocol.length > 0) {
      serverOptions.tls = {
        cert: readFileSync(path.resolve(httpsProtocol, 'cert.pem'), 'ascii'),
        key: readFileSync(path.resolve(httpsProtocol, 'key.pem'), 'ascii'),
      };
    }

    // Hapijs server creation
    this.server = new Server(serverOptions);

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
  }

  _extractAuthFunctionName(endpoint) {
    const result = authFunctionNameExtractor(endpoint, this.log);

    return result.unsupportedAuth ? null : result.authorizerName;
  }

  _configureAuthorization(
    endpoint,
    functionName,
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

    this.log(`Configuring Authorization: ${endpoint.path} ${authFunctionName}`);

    const authFunction = this.service.getFunction(authFunctionName);

    if (!authFunction)
      return this.log(
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
    const authKey = `${functionName}-${authFunctionName}-${method}-${epath}`;
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
      this.log,
      servicePath,
      serviceRuntime,
      this.service,
    );

    // Set the auth scheme and strategy on the server
    this.server.auth.scheme(authSchemeName, scheme);
    this.server.auth.strategy(authStrategyName, authSchemeName);

    return authStrategyName;
  }

  async registerPlugins() {
    try {
      await this.server.register(h2o2);
    } catch (err) {
      this.log(err);
    }
  }

  // start hapi server
  async startServer() {
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
    this.log(
      `Offline [HTTP] listening on http${
        this.options.httpsProtocol ? 's' : ''
      }://${this.options.host}:${this.options.port}`,
    );
    this.log('Enter "rp" to replay the last request');

    if (process.env.NODE_ENV !== 'test') {
      process.openStdin().addListener('data', (data) => {
        // note: data is an object, and when converted to a string it will
        // end with a linefeed.  so we (rather crudely) account for that
        // with toString() and then trim()
        if (data.toString().trim() === 'rp') {
          this._injectLastRequest();
        }
      });
    }
  }

  // stops the hapi server
  stop(timeout) {
    return this.server.stop({
      timeout,
    });
  }

  createRoutes(
    functionName,
    functionObj,
    event,
    funOptions,
    servicePath,
    protectedRoutes,
    serviceRuntime,
    defaultContentType,
  ) {
    // Handle Simple http setup, ex. - http: GET users/index
    if (typeof event.http === 'string') {
      const [method, path] = event.http.split(' ');
      event.http = { method, path };
    }

    const endpoint = new Endpoint(event.http, funOptions.handlerPath);

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

    this.log(`${method} ${fullPath}`);

    // If the endpoint has an authorization function, create an authStrategy for the route
    const authStrategyName = this.options.noAuth
      ? null
      : this._configureAuthorization(
          endpoint,
          functionName,
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
      this.log(
        'HEAD method event detected. Skipping HAPI server route mapping ...',
      );

      return;
    }

    if (routeMethod !== 'HEAD' && routeMethod !== 'GET') {
      // maxBytes: Increase request size from 1MB default limit to 10MB.
      // Cf AWS API GW payload limits.
      routeConfig.payload = {
        maxBytes: 1024 * 1024 * 10,
        parse: false,
      };
    }

    const lambdaFunction = new LambdaFunction(funOptions, this.options);

    this.server.route({
      config: routeConfig,
      method: routeMethod,
      path: fullPath,
      handler: async (request, h) => {
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
          request.multiValueHeaders = {};
          request.unprocessedHeaders = {};

          for (let i = 0; i < headersArray.length; i += 2) {
            const key = headersArray[i];
            const value = headersArray[i + 1];

            request.unprocessedHeaders[key] = value;
            request.multiValueHeaders[key] = (
              request.multiValueHeaders[key] || []
            ).concat(value);
          }
        }
        // Lib testing
        else {
          request.unprocessedHeaders = request.headers;
        }

        // Incomming request message
        this.printBlankLine();
        this.log(`${method} ${request.path} (λ: ${functionName})`);

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

          const requestToken = request.headers['x-api-key'];

          if (requestToken) {
            if (requestToken !== this.options.apiKey) {
              debugLog(
                `Method ${method} of function ${functionName} token ${requestToken} not valid`,
              );

              return errorResponse();
            }
          } else if (
            request.auth &&
            request.auth.credentials &&
            request.auth.credentials.usageIdentifierKey
          ) {
            const { usageIdentifierKey } = request.auth.credentials;

            if (usageIdentifierKey !== this.options.apiKey) {
              debugLog(
                `Method ${method} of function ${functionName} token ${usageIdentifierKey} not valid`,
              );

              return errorResponse();
            }
          } else {
            debugLog(`Missing x-api-key on private function ${functionName}`);

            return errorResponse();
          }
        }

        // Shared mutable state is the root of all evil they say
        const requestId = createUniqueId();

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

            request.payload = parse(request.payload);
          } catch (err) {
            debugLog('error in converting request.payload to JSON:', err);
          }
        }

        debugLog('requestId:', requestId);
        debugLog('contentType:', contentType);
        debugLog('requestTemplate:', requestTemplate);
        debugLog('payload:', request.payload);

        /* HANDLER LAZY LOADING */

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
              this.service.functions[functionName].environment,
            );
          }

          process.env._HANDLER = functionObj.handler;
        } catch (err) {
          return this._reply500(
            response,
            `Error while loading ${functionName}`,
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
                `Error while parsing template "${contentType}" for ${functionName}`,
                err,
              );
            }
          } else if (typeof request.payload === 'object') {
            event = request.payload || {};
          }
        } else if (integration === 'lambda-proxy') {
          event = new LambdaProxyEvent(
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
        lambdaFunction.addEvent(event);

        const processResponse = (err, data) => {
          // Everything in this block happens once the lambda function has resolved
          debugLog('_____ HANDLER RESOLVED _____');

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
              return this._reply500(
                response,
                `Error while loading ${functionName}`,
                err,
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

            this.log(`Failure: ${errorMessage}`);

            if (!this.options.hideStackTraces) {
              console.error(err.stack);
            }

            for (const [key, value] of Object.entries(endpoint.responses)) {
              if (
                key !== 'default' &&
                errorMessage.match(`^${value.selectionPattern || key}$`)
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
            Object.entries(responseParameters).forEach(([key, value]) => {
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
                    headerValue = valueArray[3]
                      ? jsonPath(result, valueArray.slice(3).join('.'))
                      : result;
                    if (
                      typeof headerValue === 'undefined' ||
                      headerValue === null
                    ) {
                      debugLog(
                        `Warning: empty value for responseParameter "${key}": "${value}"`,
                      );
                      headerValue = '';
                    } else {
                      headerValue = headerValue.toString();
                    }
                  } else {
                    this.printBlankLine();
                    this.log(
                      `Warning: while processing responseParameter "${key}": "${value}"`,
                    );
                    this.log(
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
                debugLog(
                  `Will assign "${headerValue}" to header "${headerName}"`,
                );
                response.header(headerName, headerValue);
              } else {
                this.printBlankLine();
                this.log(
                  `Warning: while processing responseParameter "${key}": "${value}"`,
                );
                this.log(
                  `Offline plugin only supports "method.response.header.PARAM_NAME" left-hand responseParameter. Found "${key}" instead. Skipping.`,
                );
                this.logPluginIssue();
                this.printBlankLine();
              }
            });
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
                const responseTemplate = responseTemplates[responseContentType];

                if (responseTemplate && responseTemplate !== '\n') {
                  debugLog('_____ RESPONSE TEMPLATE PROCCESSING _____');
                  debugLog(`Using responseTemplate '${responseContentType}'`);

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
                    this.log(
                      `Error while parsing responseTemplate '${responseContentType}' for lambda ${functionName}:`,
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
              this.log(
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
              if (result && result.body && typeof result.body !== 'string') {
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

            response.statusCode = statusCode = (result || {}).statusCode || 200;

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
              duplicate: false,
              override: false,
            });

            if (result && typeof result.body !== 'undefined') {
              if (result.isBase64Encoded) {
                response.encoding = 'binary';
                response.source = Buffer.from(result.body, 'base64');
                response.variety = 'buffer';
              } else {
                if (result && result.body && typeof result.body !== 'string') {
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
            whatToLog = stringify(result);
          } catch (error) {
            // nothing
          } finally {
            if (this.options.printOutput)
              this.log(
                err ? `Replying ${statusCode}` : `[${statusCode}] ${whatToLog}`,
              );
            debugLog('requestId:', requestId);
          }

          // Bon voyage!
          return response;
        };

        let result;

        try {
          result = await lambdaFunction.runHandler();

          const executionTime = lambdaFunction.getExecutionTimeInMillis();
          this.log(
            `Duration ${executionTime.toFixed(2)} ms (λ: ${functionName})`,
          );

          return processResponse(null, result);
        } catch (err) {
          return processResponse(err);
        }
      },
    });
  }

  // Bad news
  _reply500(response, message, error) {
    this.log(message);

    console.error(error);

    response.header('Content-Type', 'application/json');

    response.statusCode = 200; // APIG replies 200 by default on failures;
    response.source = {
      errorMessage: message,
      errorType: error.constructor.name,
      offlineInfo:
        'If you believe this is an issue with serverless-offline please submit it, thanks. https://github.com/dherault/serverless-offline/issues',
      stackTrace: this._getArrayStackTrace(error.stack),
    };

    return response;
  }

  _createResourceRoutes() {
    if (!this.options.resourceRoutes) return true;
    const resourceRoutesOptions = this.options.resourceRoutes;
    const resourceRoutes = parseResources(this.service.resources);

    if (!resourceRoutes || !Object.keys(resourceRoutes).length) return true;

    this.printBlankLine();
    this.log('Routes defined in resources:');

    Object.entries(resourceRoutes).forEach(([methodId, resourceRoutesObj]) => {
      const {
        isProxy,
        method,
        path,
        pathResource,
        proxyUri,
      } = resourceRoutesObj;

      if (!isProxy) {
        return this.log(
          `WARNING: Only HTTP_PROXY is supported. Path '${pathResource}' is ignored.`,
        );
      }
      if (!path) {
        return this.log(`WARNING: Could not resolve path for '${methodId}'.`);
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
        return this.log(`WARNING: Could not load Proxy Uri for '${methodId}'`);
      }

      const routeMethod = method === 'ANY' ? '*' : method;
      const routeConfig = { cors: this.options.corsConfig };

      // skip HEAD routes as hapi will fail with 'Method name not allowed: HEAD ...'
      // for more details, check https://github.com/dherault/serverless-offline/issues/204
      if (routeMethod === 'HEAD') {
        this.log(
          'HEAD method event detected. Skipping HAPI server route mapping ...',
        );

        return;
      }

      if (routeMethod !== 'HEAD' && routeMethod !== 'GET') {
        routeConfig.payload = { parse: false };
      }

      this.log(`${method} ${fullPath} -> ${proxyUriInUse}`);
      this.server.route({
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

          this.log(
            `PROXY ${request.method} ${request.url.path} -> ${resultUri}`,
          );

          return h.proxy({
            passThrough: true,
            uri: resultUri,
          });
        },
        method: routeMethod,
        path: fullPath,
      });
    });
  }

  _create404Route() {
    // If a {proxy+} route exists, don't conflict with it
    if (this.server.match('*', '/{p*}')) {
      return;
    }

    this.server.route({
      config: { cors: this.options.corsConfig },
      handler: (request, h) => {
        const response = h.response({
          currentRoute: `${request.method} - ${request.path}`,
          error: 'Serverless-offline: route not found.',
          existingRoutes: this.server
            .table()
            .filter((route) => route.path !== '/{p*}') // Exclude this (404) route
            .sort((a, b) => (a.path <= b.path ? -1 : 1)) // Sort by path
            .map((route) => `${route.method} - ${route.path}`), // Human-friendly result
          statusCode: 404,
        });
        response.statusCode = 404;

        return response;
      },
      method: '*',
      path: '/{p*}',
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
      this.log('Replaying HTTP last request');
      this.server.inject(this.lastRequestOptions);
    } else {
      this.log('No last HTTP request to replay!');
    }
  }
};
