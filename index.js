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
        description:   'Simulates API Gateway on localhost to call your lambda functions offline.',
        context:       'offline',
        contextAction: 'start',
        options:       [
          {
            option:      'prefix',
            shortcut:    'p',
            description: 'Optional - Add a URL prefix to each simulated API Gateway ressource.'
          }, 
          {
            option:      'port',
            shortcut:    'P',
            description: 'Optional - HTTP port to use. Default: 3000.'
          }, 
          {
            option:       'stage',
            shortcut:     's',
            description:  'Optional - The stage used to populate your velocity templates. Default: the first stage found in your project.'
          }, 
          {
            option:       'region',
            shortcut:     'r',
            description:  'Optional - The region used to populate your velocity templates. Default: the first region for the first stage found in your project.'
          }
        ]
      });
      return Promise.resolve();
    }
    
    registerHooks() {
      return Promise.resolve();
    }
    
    start(optionsAndData) {
      // this._logAndExit(optionsAndData);
      
      const version = this.S._version;
      if (!version.startsWith('0.4')) {
        SCli.log(`Offline requires Serverless v0.4.x but found ${version}. Exiting.`);
        process.exit(0);
      }
      
      this._setOptions();
      this._registerBabel();
      this._createServer();
      this._createRoutes();
      this._listen();
    }
    
    _setOptions() {
      
      if (!this.S.cli || !this.S.cli.options) throw new Error('Offline could not load options from Serverless');
      
      const userOptions = this.S.cli.options;
      const state = this.S.state;
      const stages = state.meta.stages;
      const stagesKeys = Object.keys(stages);
      
      if (!stagesKeys.length) {
        SCli.log('Offline could not find a default stage for your project: it looks like your _meta folder is empty. If you cloned your project using git, try "sls project init" to recreate your _meta folder');
        process.exit(0);
      }
      
      this.options = {
        port: userOptions.port || 3000,
        prefix: userOptions.prefix || '/',
        stage: userOptions.stage || stagesKeys[0],
        custom: state.project.custom['serverless-offline'],
      };
      
      this.options.region = userOptions.region || Object.keys(stages[this.options.stage].regions)[0];
      
      // Prefix must start and end with '/'
      if (!this.options.prefix.startsWith('/')) this.options.prefix = '/' + this.options.prefix;
      if (!this.options.prefix.endsWith('/')) this.options.prefix += '/';
      
      // this._logAndExit(this.options);
      
      SCli.log(`Starting Offline: ${this.options.stage}/${this.options.region}.`);
    }
    
    _registerBabel() {
      const custom = this.options.custom;
      if (custom && custom.babelOptions) require('babel-register')(custom.babelOptions);
    }
    
    _createServer() {
      
      this.server = new Hapi.Server({
        connections: {
          router: {
            stripTrailingSlash: true // removes trailing slashes on incoming paths.
          }
        }
      });
      
      this.server.connection({ 
        port: this.options.port
      });
      
      // If prefix, redirection from / to prefix, for practical usage
      if (this.options.prefix !== '/') this.server.route({
        method: '*',
        path: '/',
        config: { cors: true }, 
        handler: (request, reply) => {
          reply().redirect(this.options.prefix);
        }
      });
    }
    
    _createRoutes() {
      const functions = this.S.state.getFunctions();
      
      functions.forEach(fun => {
        
        if (fun.getRuntime() !== 'nodejs') return;
        
        console.log();
        SCli.log(`Routes for ${fun._config.sPath}:`);
        
        const funName = fun.name;
        const handlerParts = fun.handler.split('/').pop().split('.');
        const handlerPath = path.join(fun._config.fullPath, handlerParts[0] + '.js');
        const timeout = fun.timeout ? fun.timeout * 1000 : 6000;
        
        // Add a route for each endpoint
        fun.endpoints.forEach(ep => {
          
          let endpoint;
          
          try {
            endpoint = ep.getPopulated({
              stage: this.options.stage,
              region: this.options.region,
            });
          }
          catch(err) {
            SCli.log(`Error while populating endpoint ${ep._config.sPath} with stage '${this.options.stage}' and region '${this.options.region}':`);
            this._logAndExit(err.message);
          }
          
          // this._logAndExit(endpoint);
          
          const method = endpoint.method;
          const epath = endpoint.path;
          // const requestParams = endpoint.requestParameters;
          const requestTemplates = endpoint.requestTemplates;
          
          // Prefix must start and end with '/' BUT path must not end with '/'
          let path = this.options.prefix + (epath.startsWith('/') ? epath.slice(1) : epath);
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
              
              // Holds the response to do async op
              const serverResponse = reply.response().hold();
              
              // First we try to load the handler
              let handler;
              try {
                Object.keys(require.cache).forEach(key => {
                  // Require cache invalidation, slow, brutal and fragile. Might cause 'duplication' errors. Please submit issue
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
              
              // Then we create the event object and attempt to apply the request template
              let event;
              const requestTemplate = requestTemplates[request.mime || 'application/json'];
              
              try {
                event = this._createEvent(requestTemplate, request);
                event.isOffline = true;
              }
              catch (err) {
                SCli.log('Error while trying to use your templates:');
                console.log(err.stack || err);
                serverResponse.statusCode = 500;
                serverResponse.source = 'Error while trying to use your templates.';
                serverResponse.send();
                return;
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
        SCli.log(`Offline listening on http://localhost:${this.options.port}`);
      });
    }
    
    _createEvent(requestTemplate, request) {
      const event = {};
      
      if (!requestTemplate) return event;
      // need to implement
      return event;
    }
    
    _logAndExit() {
      for (let key in arguments) {
        console.log(arguments[key]);
      }
      process.exit(0);
    }
  };
};

const btoa = require('btoa');
const atob = require('atob');
const escapeJavaScript = require('js-string-escape');

function createVelocityContext(request, options) {
  
  options.identity = options.identity || {};
  options.stageVariables = options.stageVariables || {};
  
  return {
    context: {
      apiId: options.apiId || 'offline_apiId',
      princialId: options.princialId || 'offline_princialId',
      httpMethod: request.method,
      identity: {
        accountId: options.identity.accountId || 'offline_accountId',
        apiKey: options.identity.apiKey || 'offline_apiKey',
        caller: options.identity.caller || 'offline_caller',
        cognitoAuthenticationProvider: options.identity.cognitoAuthenticationProvider || 'offline_cognitoAuthenticationProvider',
        cognitoAuthenticationType: options.identity.cognitoAuthenticationType || 'offline_cognitoAuthenticationType',
        sourceIp: options.identity.sourceIp || request.info.remoteAddress,
        user: options.identity.user || 'offline_user',
        userAgent: request.headers['user-agent'],
        userArn: options.identity.userArn || 'offline_userArn',
        requestId: 'offline_' + Math.random(),
        resourceId: options.identity.resourceId || 'offline_resourceId',
        resourcePath: options.identity.resourcePath || 'offline_resourcePath',
        stage: options.stage
      }
    },
    input: {
      json: x => 'need to implement',
      params: x => {
        if (typeof x === 'string') return request.params[x] || request.query[x] || request.headers[x];
        else return request.params;
      },
      path: x => 'need to implement' // https://www.npmjs.com/package/jsonpath
    },
    stageVariables: options.stageVariables,
    util: {
      escapeJavaScript,
      urlEncode: encodeURI,
      urlDecode: decodeURI,
      base64Encode: btoa,
      base64Decode: atob,
    }
  };
} 
