'use strict';

const fs = require('fs');
const path = require('path');
const hapi = require('@hapi/hapi');
const h2o2 = require('@hapi/h2o2');
const boom = require('@hapi/boom');
const hapiPluginWebsocket = require('./hapi-plugin-websocket');
const debugLog = require('./debugLog');
const LambdaContext = require('./LambdaContext.js');
const functionHelper = require('./functionHelper');
const wsHelpers = require('./websocketHelpers');

module.exports = class ApiGatewayWebSocket {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.service = serverless.service;
    this.serverlessLog = serverless.cli.log.bind(serverless.cli);
    this.options = options;
    this.exitCode = 0;
    this.clients = {};
    this.actions = {};
    this.websocketsApiRouteSelectionExpression = serverless.service.provider.websocketsApiRouteSelectionExpression || '$request.body.action';
    this.funsWithNoEvent = {};
  }

  printBlankLine() {
    console.log();
  }

  _createWebSocket() {
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

    this.wsServer.register(hapiPluginWebsocket).catch(err => err && this.serverlessLog(err));

    const doAction = (name, event, doDefaultAction) => new Promise((resolve, reject) => {
      const handleError = err => {
        debugLog(`Error in handler of action ${action}`, err);
        reject(err);
      };
      let action = this.actions[name];
      if (!action && doDefaultAction) action = this.actions.$default;
      if (!action) {
        resolve();

        return;
      }
      function cb(err) {
        if (!err) resolve(); else handleError(err);
      }

      // TEMP
      const func = {
        ...action.fun,
        name,
      };
      const context = new LambdaContext(func, this.service.provider, cb);

      let p = null;
      try {
        p = action.handler(event, context, cb);
      }
      catch (err) {
        handleError(err);
      }

      if (p) p.then(() => resolve()).catch(err => handleError(err));
    });

    const encodeConnectionId = unencoded => unencoded.replace(new RegExp('/', 'g'), 'S'); // relaces all '/' chars with 'S'

    const scheme = (/* server, options */) => {
      
      const rv = {
        authenticate: async (request, h) => {
          if (!this.connectAuth) return h.unauthenticated();

          const authorization = request.headers[this.connectAuth.header.toLowerCase()];
          if (!authorization) throw boom.unauthorized();
          const auth = this.funsWithNoEvent[this.connectAuth.name];
          if (!auth) throw boom.unauthorized();

          const connectionId = encodeConnectionId(request.headers['sec-websocket-key']);
          let connection = this.clients[connectionId];
          if (!connection) { 
            connection = { connectionId, connectionTime:Date.now() };
            this.clients[connectionId] = connection;
          }

          const event = wsHelpers.createAuthEvent(connection, request.headers, this.connectAuth.header, this.options);
          const checkPolicy = policy => {
            if (
              policy && 
              policy.policyDocument && 
              policy.policyDocument.Statement &&
              policy.policyDocument.Statement[0] && 
              policy.policyDocument.Statement[0].Effect === 'Allow') return 200;
            
            return 403;
          };
          const status = await new Promise(resolve => {
            function cb(err, policy) {
              if (err) { 
                this.serverlessLog(err);
                resolve(403);
              } 
              else {
                resolve(checkPolicy(policy));
              }
            }
      
            // TEMP
            const func = {
              ...auth.fun,
              name: this.connectAuth.name,
            };
          
            const context = new LambdaContext(func, this.service.provider, cb);
            let p = null;
            try { 
              p = auth.handler(event, context, cb);
            } 
            catch (err) {
              this.serverlessLog(err);
              resolve(403);
            }

            if (p) { 
              p.then(policy => {
                resolve(checkPolicy(policy));
              }).catch(err => { 
                this.serverlessLog(err);
                resolve(403);
              });
            }
          });
          if (status === 403) throw boom.forbidden();

          return h.authenticated({ credentials: {} });
        },
      };
      
      return rv;
    };
    this.wsServer.auth.scheme('websocket', scheme);
    this.wsServer.auth.strategy('connect', 'websocket');

    this.wsServer.route({
      method: 'POST',
      path: '/',
      config: {
        auth: 'connect',
        payload: { output: 'data', parse: true, allow: 'application/json' },
        plugins: {
          websocket: {
            only: true,
            initially: false,
            connect: ({ ws, req }) => {
              const connection = this.clients[encodeConnectionId(req.headers['sec-websocket-key'])];
              if (!connection) return;
              debugLog(`connect:${connection.connectionId}`);
              connection.ws = ws;
            },
            message: ({ ws, req, message }) => { 
              debugLog(`message:${message}`);
        
              if (!message) return;
              const connection = this.clients[encodeConnectionId(req.headers['sec-websocket-key'])];
              let json = null;
              try { 
                json = JSON.parse(message); 
              } catch (err) {} // eslint-disable-line brace-style, no-empty

              let actionName = null;
              if (this.websocketsApiRouteSelectionExpression.startsWith('$request.body.')) {
                actionName = json;
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
              const event = wsHelpers.createEvent(action, connection, message, this.options);

              doAction(action, event, true).catch(() => {
                if (ws.readyState === /* OPEN */1) ws.send(JSON.stringify({ message:'Internal server error', connectionId:connection.connectionId, requestId:'1234567890' }));
              });
            },
            disconnect: ({ req }) => {
              const connection = this.clients[encodeConnectionId(req.headers['sec-websocket-key'])];
              if (!connection) return;
              debugLog(`disconnect:${connection.connectionId}`);
              delete this.clients[connection.connectionId];
              const event = wsHelpers.createDisconnectEvent(connection, this.options);

              doAction('$disconnect', event, false);
            },
          },
        },
      },

      handler: async (request, h) => {
        const queryStringParameters = Object.fromEntries(request.url.searchParams.entries());
        const connectionId = encodeConnectionId(request.headers['sec-websocket-key']);
        let connection = this.clients[connectionId];
        if (!connection) { 
          connection = { connectionId, connectionTime:Date.now() };
          this.clients[connectionId] = connection;
        }
        debugLog(`handling connect request:${connection.connectionId}`);

        let event = wsHelpers.createConnectEvent(connection, request.headers, this.options);
        if (Object.keys(queryStringParameters).length > 0) event = { queryStringParameters, ...event };

        const status = await doAction('$connect', event, false).then(() => 200).catch(err => {
          this.serverlessLog(err);

          return 502;
        });

        return h.response().code(status);
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
        const connection = this.clients[request.params.connectionId];
        if (!connection || !connection.ws) return h.response().code(410);
        if (!request.payload) return h.response().code(200);
        connection.ws.send(request.payload.toString());
        debugLog(`sent data to connection:${request.params.connectionId}`);

        return h.response().code(200);
      },
    });

    this.wsServer.route({
      method: 'DELETE',
      path: '/@connections/{connectionId}',
      config: { payload: { parse: false } },
      handler: (request, h) => {
        debugLog(`got DELETE to ${request.url}`);
        const connection = this.clients[request.params.connectionId];
        if (connection) delete this.clients[request.params.connectionId];
        if (!connection || !connection.ws) return h.response().code(410);
        connection.ws.close();
        debugLog(`closed connection:${request.params.connectionId}`);
        
        return h.response().code(204);
      },
    });
  }

  _createAction(fun, funName, servicePath, funOptions, event) {
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
    catch (error) {
      return this.serverlessLog(`Error while loading ${funName}`, error);
    }

    const actionName = event.websocket.route;
    const action = { funName, fun, funOptions, servicePath, handler };

    this.actions[actionName] = action;
    this.serverlessLog(`Action '${event.websocket.route}'`);
  }

  _createConnectWithAutherizerAction(fun, funName, servicePath, funOptions, event, funsWithNoEvent) {
    this.funsWithNoEvent = funsWithNoEvent;
    this._createAction(fun, funName, servicePath, funOptions, event);
    if (typeof event.websocket.authorizer === 'object') {
      const {name, identitySource} = event.websocket.authorizer;
      if (identitySource && identitySource[0] && identitySource[0].startsWith('route.request.header.')) this.connectAuth = { name, header:identitySource[0].replace('route.request.header.', '')};
      else this.serverlessLog('ERROR: WebSocket Authorizer only supports header authorization.');
    } else this.connectAuth = { name:event.websocket.authorizer, header:'Auth'};
  }

  // All done, we can listen to incomming requests
  async _listen() {
    try {
      await this.wsServer.start();
    }
    catch (error) {
      console.error(`Unexpected error while starting serverless-offline websocket server on port ${this.options.websocketPort}:`, error);
      process.exit(1);
    }

    this.printBlankLine();
    this.serverlessLog(`Offline [websocket] listening on ws${this.options.httpsProtocol ? 's' : ''}://${this.options.host}:${this.options.websocketPort}`);
    this.serverlessLog(`Offline [websocket] listening on http${this.options.httpsProtocol ? 's' : ''}://${this.options.host}:${this.options.websocketPort}/@connections/{connectionId}`);
  }
};
