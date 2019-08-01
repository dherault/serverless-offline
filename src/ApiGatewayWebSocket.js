'use strict';

const { readFileSync } = require('fs');
const path = require('path');
const { URL } = require('url');
const { Server } = require('@hapi/hapi');
const hapiPluginWebsocket = require('hapi-plugin-websocket');
const authFunctionNameExtractor = require('./authFunctionNameExtractor.js');
const debugLog = require('./debugLog.js');
const { createHandler } = require('./functionHelper.js');
const LambdaContext = require('./LambdaContext.js');
const {
  createUniqueId,
  parseQueryStringParameters,
} = require('./utils/index.js');
const wsHelpers = require('./websocketHelpers.js');

const { stringify } = JSON;

// dummy placeholder url for the WHATWG URL constructor
// https://github.com/nodejs/node/issues/12682
// TODO move to common constants file
const BASE_URL_PLACEHOLDER = 'http://example';

module.exports = class ApiGatewayWebSocket {
  constructor(serverless, options) {
    this.service = serverless.service;
    this.log = serverless.cli.log.bind(serverless.cli);
    this.options = options;
    this.clients = new Map();
    this.actions = {};
    this.websocketsApiRouteSelectionExpression =
      serverless.service.provider.websocketsApiRouteSelectionExpression ||
      '$request.body.action';
  }

  printBlankLine() {
    if (process.env.NODE_ENV !== 'test') {
      console.log();
    }
  }

  async _createWebSocket() {
    // start COPY PASTE FROM HTTP SERVER CODE
    const serverOptions = {
      host: this.options.host,
      port: this.options.websocketPort,
      router: {
        stripTrailingSlash: !this.options.preserveTrailingSlash, // removes trailing slashes on incoming paths.
      },
    };

    const httpsDir = this.options.httpsProtocol;

    // HTTPS support
    if (typeof httpsDir === 'string' && httpsDir.length > 0) {
      serverOptions.tls = {
        cert: readFileSync(path.resolve(httpsDir, 'cert.pem'), 'ascii'),
        key: readFileSync(path.resolve(httpsDir, 'key.pem'), 'ascii'),
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
    this.wsServer = new Server(serverOptions);

    // Enable CORS preflight response
    this.wsServer.ext('onPreResponse', (request, h) => {
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
    // end COPY PASTE FROM HTTP SERVER CODE

    try {
      await this.wsServer.register(hapiPluginWebsocket);
    } catch (e) {
      this.log(e);
    }

    const doAction = (ws, connectionId, name, event, doDefaultAction) => {
      const sendError = (err) => {
        if (ws.readyState === /* OPEN */ 1) {
          ws.send(
            stringify({
              connectionId,
              message: 'Internal server error',
              requestId: '1234567890',
            }),
          );
        }

        // mimic AWS behaviour (close connection) when the $connect action handler throws
        if (name === '$connect') {
          ws.close();
        }

        debugLog(`Error in handler of action ${action}`, err);
      };

      let action = this.actions[name];

      if (!action && doDefaultAction) action = this.actions.$default;
      if (!action) return;

      function callback(err) {
        if (!err) return;
        sendError(err);
      }

      // TEMP
      const func = {
        ...action.functionObj,
        name,
      };

      const context = new LambdaContext({
        callback,
        functionName: func.name,
        memorySize: func.memorySize || this.service.provider.memorySize,
        timeout: func.timeout || this.service.provider.timeout,
      });

      let p = null;

      try {
        p = action.handler(event, context, callback);
      } catch (err) {
        sendError(err);
      }

      if (p) {
        p.catch((err) => {
          sendError(err);
        });
      }
    };

    this.wsServer.route({
      method: 'POST',
      path: '/',
      config: {
        payload: {
          allow: 'application/json',
          output: 'data',
          parse: true,
        },
        plugins: {
          websocket: {
            initially: false,
            only: true,
            connect: ({ ws, req }) => {
              const { searchParams } = new URL(req.url, BASE_URL_PLACEHOLDER);
              const queryStringParameters = parseQueryStringParameters(
                searchParams,
              );
              const connection = {
                connectionId: createUniqueId(),
                connectionTime: Date.now(),
              };

              debugLog(`connect:${connection.connectionId}`);

              this.clients.set(ws, connection);

              let event = wsHelpers.createConnectEvent(
                '$connect',
                'CONNECT',
                connection,
                this.options,
              );

              if (Object.keys(queryStringParameters || {}).length > 0) {
                event = { queryStringParameters, ...event };
              }

              doAction(ws, connection.connectionId, '$connect', event, false);
            },
            disconnect: ({ ws }) => {
              const connection = this.clients.get(ws);

              debugLog(`disconnect:${connection.connectionId}`);

              this.clients.delete(ws);

              const event = wsHelpers.createDisconnectEvent(
                '$disconnect',
                'DISCONNECT',
                connection,
              );

              doAction(
                ws,
                connection.connectionId,
                '$disconnect',
                event,
                false,
              );
            },
          },
        },
      },
      handler: (request, h) => {
        const { initially, ws } = request.websocket();

        if (!request.payload || initially) {
          return h.response().code(204);
        }

        const connection = this.clients.get(ws);
        let actionName = null;

        if (
          this.websocketsApiRouteSelectionExpression.startsWith(
            '$request.body.',
          )
        ) {
          actionName = request.payload;

          if (typeof actionName === 'object') {
            this.websocketsApiRouteSelectionExpression
              .replace('$request.body.', '')
              .split('.')
              .forEach((key) => {
                if (actionName) {
                  actionName = actionName[key];
                }
              });
          } else actionName = null;
        }

        if (typeof actionName !== 'string') {
          actionName = null;
        }

        const action = actionName || '$default';

        debugLog(`action:${action} on connection=${connection.connectionId}`);

        const event = wsHelpers.createEvent(
          action,
          'MESSAGE',
          connection,
          request.payload,
        );

        doAction(ws, connection.connectionId, action, event, true);

        return h.response().code(204);
      },
    });

    this.wsServer.route({
      handler: (request, h) => h.response().code(426),
      method: 'GET',
      path: '/{path*}',
    });

    this.wsServer.route({
      config: {
        payload: {
          parse: false,
        },
      },
      method: 'POST',
      path: '/@connections/{connectionId}',
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

        debugLog(`sent data to connection:${request.params.connectionId}`);

        return '';
      },
    });

    this.wsServer.route({
      config: {
        payload: {
          parse: false,
        },
      },
      method: 'DELETE',
      path: '/@connections/{connectionId}',
      handler: (request, h) => {
        debugLog(`got DELETE to ${request.url}`);

        const getByConnectionId = (map, searchValue) => {
          for (const [key, connection] of map.entries()) {
            if (connection.connectionId === searchValue) return key;
          }

          return undefined;
        };

        const ws = getByConnectionId(this.clients, request.params.connectionId);

        if (!ws) return h.response().code(410);

        ws.close();

        debugLog(`closed connection:${request.params.connectionId}`);

        return '';
      },
    });
  }

  _createWsAction(functionName, functionObj, event, funOptions, servicePath) {
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
      } else {
        Object.assign(
          process.env,
          { AWS_REGION: this.service.provider.region },
          this.service.provider.environment,
          this.service.functions[functionName].environment,
        );
      }

      process.env._HANDLER = functionObj.handler;
      handler = createHandler(funOptions, this.options);
    } catch (error) {
      return this.log(`Error while loading ${functionName}`, error);
    }

    const actionName = event.websocket.route;
    const action = {
      functionObj,
      functionName,
      funOptions,
      handler,
      servicePath,
    };

    this.actions[actionName] = action;
    this.log(`Action '${event.websocket.route}'`);
  }

  _extractAuthFunctionName(endpoint) {
    const result = authFunctionNameExtractor(endpoint, this.log);

    return result.unsupportedAuth ? null : result.authorizerName;
  }

  // All done, we can listen to incomming requests
  async _listen() {
    try {
      await this.wsServer.start();
    } catch (error) {
      console.error(
        `Unexpected error while starting serverless-offline websocket server on port ${this.options.websocketPort}:`,
        error,
      );
      process.exit(1);
    }

    this.printBlankLine();
    this.log(
      `Offline [websocket] listening on ws${
        this.options.httpsProtocol ? 's' : ''
      }://${this.options.host}:${this.options.websocketPort}`,
    );
  }
};
