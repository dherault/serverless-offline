'use strict';

const fs = require('fs');
const path = require('path');
const hapi = require('@hapi/hapi');
const h2o2 = require('@hapi/h2o2');
const debugLog = require('./debugLog');
const createAuthScheme = require('./createAuthScheme');
const functionHelper = require('./functionHelper');
const { getUniqueId } = require('./utils');
const authFunctionNameExtractor = require('./authFunctionNameExtractor');
const wsHelpers = require('./websocketHelpers');

module.exports = class ApiGatewayWebSocket {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.service = serverless.service;
    this.serverlessLog = serverless.cli.log.bind(serverless.cli);
    this.options = options;
    this.exitCode = 0;
    this.clients = new Map();
    this.wsActions = {};
    this.websocketsApiRouteSelectionExpression = serverless.service.provider.websocketsApiRouteSelectionExpression || '$request.body.action';
  }

  printBlankLine() {
    console.log();
  }

  logPluginIssue() {
    this.serverlessLog('If you think this is an issue with the plugin please submit it, thanks!');
    this.serverlessLog('https://github.com/dherault/serverless-offline/issues');
  }

  _createWebSocket() {
    // start COPY PASTE FROM HTTP SERVER CODE
    const serverOptions = {
      host: this.options.host,
      port: this.options.wsPort,
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
      isSameSite: false,
      isSecure: true,
    } : {
      isHttpOnly: false,
      isSameSite: false,
      isSecure: false,
    };

    // Hapijs server creation
    this.wsServer = hapi.server(serverOptions);

    this.wsServer.register(h2o2).catch(err => err && this.serverlessLog(err));

    // Enable CORS preflight response
    this.wsServer.ext('onPreResponse', (request, h) => {
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
    // end COPY PASTE FROM HTTP SERVER CODE

    this.wsServer.register(require('hapi-plugin-websocket')).catch(err => err && this.serverlessLog(err));

    const doAction = (ws, connectionId, name, event, context, doDeafultAction/* , onError */) => {
      const sendError = err => {
        if (ws.readyState === /* OPEN */1) ws.send(JSON.stringify({ message:'Internal server error', connectionId, requestId:'1234567890' }));
        debugLog(`Error in handler of action ${action}`, err);
      };
      let action = this.wsActions[name];
      if (!action && doDeafultAction) action = this.wsActions.$default;
      if (!action) return;
      let p = null;
      try {
        p = action.handler(event, context, err => {
          if (!err) return;
          sendError(err);
        });
      }
      catch (err) {
        sendError(err);
      }

      if (p) {
        p.catch(err => {
          sendError(err);
        });
      }
    };

    this.wsServer.route({
      method: 'POST',
      path: '/',
      config: {
        payload: { output: 'data', parse: true, allow: 'application/json' },
        plugins: {
          websocket: {
            only: true,
            initially: false,
            connect: ({ ws, req }) => {
              const parseQuery = queryString => {
                const query = {}; const parts = queryString.split('?');
                if (parts.length < 2) return {};
                const pairs = parts[1].split('&');
                pairs.forEach(pair => {
                  const kv = pair.split('=');
                  query[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
                });

                return query;
              };

              const queryStringParameters = parseQuery(req.url);
              const connection = { connectionId:getUniqueId(), connectionTime:Date.now() };
              debugLog(`connect:${connection.connectionId}`);

              this.clients.set(ws, connection);
              let event = wsHelpers.createConnectEvent('$connect', 'CONNECT', connection, this.options);
              if (Object.keys(queryStringParameters).length > 0) event = { queryStringParameters, ...event };
              const context = wsHelpers.createContext('$connect');

              doAction(ws, connection.connectionId, '$connect', event, context);
            },
            disconnect: ({ ws }) => {
              const connection = this.clients.get(ws);
              debugLog(`disconnect:${connection.connectionId}`);
              this.clients.delete(ws);
              const event = wsHelpers.createDisconnectEvent('$disconnect', 'DISCONNECT', connection, this.options);
              const context = wsHelpers.createContext('$disconnect');

              doAction(ws, connection.connectionId, '$disconnect', event, context);
            },
          },
        },
      },

      handler: (request, h) => {
        const { initially, ws } = request.websocket();
        if (!request.payload || initially) return h.response().code(204);
        const connection = this.clients.get(ws);
        let actionName = null;
        if (this.websocketsApiRouteSelectionExpression.startsWith('$request.body.')) {
          actionName = request.payload;
          if (typeof actionName === 'object') {
            this.websocketsApiRouteSelectionExpression.replace('$request.body.', '').split('.').forEach(key => {
              if (actionName) actionName = actionName[key];
            });
          }
          else actionName = null;
        }
        if (typeof actionName !== 'string') actionName = null;
        const action = actionName || '$default';
        debugLog(`action:${action} on connection=${connection.connectionId}`);
        const event = wsHelpers.createEvent(action, 'MESSAGE', connection, request.payload, this.options);
        const context = wsHelpers.createContext(action);

        doAction(ws, connection.connectionId, action, event, context, true);

        return h.response().code(204);
      },
    });

    this.wsServer.route({
      method: 'GET',
      path: '/{path*}',
      handler: (request, h) => h.response().code(426),
    });

    this.wsServer.route({
      method: 'POST',
      path: '/@connections/{connectionId}',
      config: { payload: { parse: false } },
      handler: (request, h) => {
        debugLog(`got POST to ${request.url}`);
        const getByConnectionId = (map, searchValue) => {
          for (const [key, connection] of map.entries()) {
            if (connection.connectionId === searchValue) return key;
          }

          return undefined;
        };

        const ws = getByConnectionId(this.clients, request.params.connectionId);
        if (!ws) return h.response().code(410);
        if (!request.payload) return '';
        ws.send(request.payload.toString());
        // console.log(`sent "${request.payload.toString().substring}" to ${request.params.connectionId}`);
        debugLog(`sent data to connection:${request.params.connectionId}`);

        return '';
      },
    });
  }

  _createWsAction(fun, funName, servicePath, funOptions, event) {
    let handler; // The lambda function
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
          this.service.functions[funName].environment
        );
      }
      process.env._HANDLER = fun.handler;
      handler = functionHelper.createHandler(funOptions, this.options);
    }
    catch (err) {
      return this.serverlessLog(`Error while loading ${funName}`, err);
    }

    const actionName = event.websocket.route;
    const action = { funName, fun, funOptions, servicePath, handler };
    this.wsActions[actionName] = action;
    this.serverlessLog(`Action '${event.websocket.route}'`);
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
      await this.wsServer.start();
    }
    catch (e) {
      console.error(`Unexpected error while starting serverless-offline websocket server on port ${this.options.wsPort}:`, e);
      process.exit(1);
    }

    this.printBlankLine();
    this.serverlessLog(`Offline [websocket] listening on ws${this.options.httpsProtocol ? 's' : ''}://${this.options.host}:${this.options.wsPort}`);
  }
};
