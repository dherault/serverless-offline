'use strict';

module.exports = function(ServerlessPlugin, serverlessPath) {
  
  const path = require('path');
  const Hapi = require('hapi');
  const Engine = require('velocity').Engine;
  // const SUtils = require(path.join(serverlessPath, 'utils'));
  const SCli = require(path.join(serverlessPath, 'utils', 'cli'));
  const context = require(path.join(serverlessPath, 'utils', 'context'));
  const reInputParam = /\$input\.params\(\s*'(.*)'\s*\)/;

  return class Offline extends ServerlessPlugin {
    
    constructor(S) {
      super(S);
    }
    
    static getName() {
      return 'serverless-offline';
    }
    
    registerActions() {
      this.S.addAction(this.start.bind(this), {
        handler:       'start',
        description:   'Simulates API Gateway to call your lambda functions offline',
        context:       'offline',
        contextAction: 'start',
        options:       [
          {
            option:      'prefix',
            shortcut:    'p',
            description: 'Optional - Add a URL prefix to each simulated API Gateway ressource'
          }, 
          {
            option:      'port',
            shortcut:    'P',
            description: 'Optional - HTTP port to use, default: 3000'
          }, 
          {
            option:       'stage',
            shortcut:     's',
            description:  'Optional - If stage and region are given, the plugin will use your velocity templates'
          }, 
          {
            option:       'region',
            shortcut:     'r',
            description:  'Optional - If stage and region are given, the plugin will use your velocity templates'
          }
        ]
      });
      return Promise.resolve();
    }
    
    registerHooks() {
      return Promise.resolve();
    }
    
    _createServer() {
      
      this.server = new Hapi.Server({
        connections: {
          router: {
            stripTrailingSlash: true // removes trailing slashes on incoming paths.
          }
        }
      });
      
      this.port = this.evt.port || 3000;
      
      this.server.connection({ 
        port: this.port
      });
      
      // Prefix must start and end with '/'
      let prefix = this.evt.prefix || '/';
      
      if (!prefix.startsWith('/')) prefix = '/' + prefix;
      if (!prefix.endsWith('/')) prefix += '/';
      
      this.prefix = prefix;
      
      // If prefix, redirection from / to prefix
      if (prefix !== '/') this.server.route({
        method: '*',
        path: '/',
        config: { cors: true }, 
        handler: (request, reply) => {
          reply().redirect(prefix);
        }
      });
    }
    
    _registerLambdas() {
      const functions = this.S.state.getFunctions();
      
      functions.forEach(fun => {
        
        if (fun.getRuntime() !== 'nodejs') return;
        
        console.log();
        SCli.log(`Routes for ${fun._config.sPath}:`);
        
        // const x = new this.S.classes.Function(this.S, {
        //   sPath: fun._config.sPath
        // })
        
        // console.log(x.getPopulated({
        //   stage: 'dev',
        //   region: 'eu-west-1'
        // }).endpoints[0]);
        
        const funName = fun.name;
        const handlerParts = fun.handler.split('/').pop().split('.');
        const handlerPath = path.join(fun._config.fullPath, handlerParts[0] + '.js');
        const timeout = fun.timeout ? fun.timeout * 1000 : 6000;
        
        // Add a route for each endpoint
        fun.endpoints.forEach(endpoint => {
          
          const canPopulate = this.evt.stage && this.evt.region;
          
          const populatedEndpoint = this.evt.stage && this.endpoint.getPopulated({
            stage: 'dev',
            region: 'eu-west-1'
          });
          
          console.log(x);
          const method = endpoint.method;
          const epath = endpoint.path;
          // const requestParams = endpoint.requestParameters;
          const requestTemplates = endpoint.requestTemplates;
          
          // Prefix must start and end with '/' BUT path must not end with '/'
          let path = this.prefix + (epath.startsWith('/') ? epath.slice(1) : epath);
          if (path !== '/' && path.endsWith('/')) path = path.slice(0, -1);
          
          SCli.log(`${method} ${path}`);
          
          this.server.route({
            method, 
            path,
            config: { 
              cors: true,
              timeout: {
                server: timeout
              }
            }, 
            handler: (request, reply) => {
              console.log();
              SCli.log(`${method} ${request.url.path} (λ: ${funName})`);
              
              const serverResponse = reply.response().hold();
              
              // First we try to load the handler
              let handler;
              try {
                Object.keys(require.cache).forEach(key => {
                  // Require cache invalidation, slow and brutal
                  if (!key.match('babel')) delete require.cache[key];
                }); 
                handler = require(handlerPath)[handlerParts[1]];
                if (!handler || typeof handler !== 'function') throw new Error(`Serverless-offline: handler for function ${funName} is not a function`);
              } 
              catch(err) {
                SCli.log(`Error while loading ${funName}`);
                console.log(err.stack || err);
                serverResponse.statusCode = 500;
                serverResponse.source = `<html>
                  <body>
                    <div>[Serverless-offline] An error occured when loading <strong>${funName}</strong>:</div>
                    <br/>
                    <div>
                      ${err.stack ? err.stack.replace(/(\r\n|\n|\r)/gm,'<br/>') : err.toString()}
                    </div>
                  </body>
                </html>`;
                serverResponse.send();
                return;
              }
              
              // Then we create the event object
              const event = Object.assign({ isServerlessOffline: true }, request);
              
              if (requestTemplates && this.evt.useTemplates) {
                // Apply request template to event
                try {
                  const contentType = request.mime || 'application/json';
                  
                  if (contentType in requestTemplates) {
                    let toApply = JSON.parse(requestTemplates[contentType]);
                    
                    // TODO: proces $context variables in a more complete way http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#context-variable-reference
                    // TODO: $input could also be dealt with in a more robust way http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#input-variable-reference
                    for (let key in toApply) {
                      
                      if (toApply[key] === '$context.httpMethod') {
                        event[key] = request.method.toUpperCase();
                      } else if (toApply[key] === '$input.params()') {
                        event[key] = request.params;
                      } else {
                        const reResp = reInputParam.exec(toApply[key]);
                        if (reResp) {
                          // lookup variable replacement in params
                          const paramName = reResp[1];
                          event[key] = paramName in event.params ? event.params[paramName] : '';
                        }
                        else {
                          event[key] = toApply[key];
                        }
                      }
                    }
                  }
                }
                catch (err) {
                  SCli.log('Error while trying to use your templates:');
                  console.log(err.stack || err);
                  serverResponse.statusCode = 500;
                  serverResponse.source = 'Error while trying to use your templates.';
                  serverResponse.send();
                  return;
                }
              }
              
              // Finally we call the handler
              handler(event, context(fun.name, (err, result) => {
                let finalResponse;
                let finalResult;
                
                // Failure handling
                if (err) {
                  const errorMessage = err.message || err.toString();
                  
                  finalResult = { 
                    errorMessage,
                    errorType: err.constructor.name,
                    stackTrace: err.stack ? err.stack.split('\n') : null
                  };
                  
                  SCli.log(`Failure: ${errorMessage}`);
                  if (err.stack) console.log(err.stack);
                  
                  Object.keys(endpoint.responses).forEach(key => {
                    const x = endpoint.responses[key];
                    if (!finalResponse && key !== 'default' && x.selectionPattern && errorMessage.match('^' + x.selectionPattern)) { // I don't know why lambda choose to enforce the "starting with" condition on their regex
                      finalResponse = x;
                    }
                  });
                }
                
                finalResponse = finalResponse || endpoint.responses['default'];
                finalResult = finalResult || result;
                
                serverResponse.statusCode = finalResponse.statusCode;
                serverResponse.source = finalResult;
                
                let whatToLog = finalResult;
                
                try {
                  whatToLog = JSON.stringify(finalResult);
                } 
                catch(err) {
                  SCli.log(`Error while parsing result:`);
                  console.log(err.stack);
                }
                
                SCli.log(err ? `Replying ${finalResponse.statusCode}` : `[${finalResponse.statusCode}] ${whatToLog}`);
                
                serverResponse.send();
              }));
            },
          });
        });
      });
    }
    
    _listen() {
      this.server.start(err => {
        if (err) throw err;
        console.log();
        SCli.log(`Offline listening on http://localhost:${this.port}`);
      });
    }
    
    _registerBabel() {
      return new this.S.classes.Project(this.S).load().then(project => { // Promise to load project
        const custom = project.custom['serverless-offline'];
        
        if (custom && custom.babelOptions) {
          require('babel-register')(custom.babelOptions);
        }
      });
    }
    
    start(evt) {
      SCli.log(`Starting Offline`);
      
      if (this.S.cli) {
        evt = JSON.parse(JSON.stringify(this.S.cli.options));
        if (this.S.cli.options.nonInteractive) this.S._interactive = false;
      }
      
      this.evt = evt;
      
      return this._registerBabel()
        .then(this._createServer.bind(this))
        .then(this._registerLambdas.bind(this))
        .then(this._listen.bind(this));
    }
  };
};

function createVelocityContext(hapijsRequest, options) {
  
  options.identity = options.identity || {};
  options.stageVariables = options.stageVariables || {};
  
  return {
    context: {
      apiId: options.apiId || 'offline_apiId',
      princialId: options.princialId || 'offline_princialId',
      httpMethod: hapijsRequest.method,
      identity: {
        accountId: options.identity.accountId || 'offline_accountId',
        apiKey: options.identity.apiKey || 'offline_apiKey',
        caller: options.identity.caller || 'offline_caller',
        cognitoAuthenticationProvider: options.identity.cognitoAuthenticationProvider || 'offline_cognitoAuthenticationProvider',
        cognitoAuthenticationType: options.identity.cognitoAuthenticationType || 'offline_cognitoAuthenticationType',
        sourceIp: options.identity.sourceIp || hapijsRequest.info.remoteAddress,
        user: options.identity.user || 'offline_user',
        userAgent: hapijsRequest.headers['user-agent'],
        userArn: options.identity.userArn || 'offline_userArn',
        requestId: Math.random().toString(),
        resourceId: options.identity.resourceId || 'offline_resourceId',
        resourcePath: options.identity.resourcePath || 'offline_resourcePath',
        stage: options.stage
      }
    },
    input: {
      json: x => 'need to implement',
      params: x => {
        if (typeof x === 'string') return hapijsRequest.params[x] || hapijsRequest.query[x] || hapijsRequest.headers[x];
        else return hapijsRequest.params;
      },
      path: x => 'need to implement'
    },
    stageVariables: options.stageVariables,
    util: {
      escapeJavaScript: x => 'need to implement',
      urlEncode: x => 'need to implement',
      urlDecode: x => 'need to implement',
      base64Encode: x => 'need to implement',
      base64Decode: x => 'need to implement',
    }
  };
} 
