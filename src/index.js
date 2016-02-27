'use strict';

module.exports = function(ServerlessPlugin, serverlessPath) {
  
  const path = require('path');
  const Hapi = require('hapi');
  const serverlessLog = require(path.join(serverlessPath, 'utils', 'cli')).log;
  const serverlessContext = require(path.join(serverlessPath, 'utils', 'context'));
  const renderVelocityTemplateObject = require('./renderVelocityTemplateObject');
  const createVelocityContext = require('./createVelocityContext');

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
        serverlessLog(`Offline requires Serverless v0.4.x but found ${version}. Exiting.`);
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
        serverlessLog('Offline could not find a default stage for your project: it looks like your _meta folder is empty. If you cloned your project using git, try "sls project init" to recreate your _meta folder');
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
      
      serverlessLog(`Starting Offline: ${this.options.stage}/${this.options.region}.`);
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
        serverlessLog(`Routes for ${fun._config.sPath}:`);
        
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
            serverlessLog(`Error while populating endpoint ${ep._config.sPath} with stage '${this.options.stage}' and region '${this.options.region}':`);
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
          
          serverlessLog(`${method} ${path}`);
          
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
              serverlessLog(`${method} ${request.url.path} (λ: ${funName})`);
              
              // Holds the response to do async op
              const response = reply.response().hold();
              
              // First we try to load the handler
              let handler;
              try {
                Object.keys(require.cache).forEach(key => {
                  // Require cache invalidation, brutal and fragile. 
                  // Might cause errors, if so, please submit issue.
                  if (!key.match('node_modules')) delete require.cache[key];
                }); 
                handler = require(handlerPath)[handlerParts[1]];
                if (typeof handler !== 'function') throw new Error(`Serverless-offline: handler for function ${funName} is not a function`);
              } 
              catch(err) {
                return this._reply500(response, `Error while loading ${funName}`, err);
              }
              
              // Then we create the event object and attempt to apply the request template
              let event = { isOffline: true };
              const contentType = request.mime || 'application/json';
              const requestTemplate = requestTemplates[contentType];
              
              if (requestTemplate) {
                try {
                  event = {}; // Magick will happen here;
                }
                catch (err) {
                  return this._reply500(response, `Error while parsing template "${contentType}" for ${funName}`, err);
                }
              }
              
              // Finally we call the handler
              handler(event, serverlessContext(fun.name, (err, result) => {
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
                  
                  serverlessLog(`Failure: ${errorMessage}`);
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
                
                response.statusCode = finalResponse.statusCode;
                response.source = finalResult;
                
                let whatToLog = finalResult;
                
                try {
                  whatToLog = JSON.stringify(finalResult);
                } 
                catch(err) {
                  serverlessLog(`Error while parsing result:`);
                  console.log(err.stack);
                }
                
                serverlessLog(err ? `Replying ${finalResponse.statusCode}` : `[${finalResponse.statusCode}] ${whatToLog}`);
                
                response.send();
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
        serverlessLog(`Offline listening on http://localhost:${this.options.port}`);
      });
    }
    
    _reply500(response, message, err) {
      serverlessLog(message);
      console.log(err.stack || err);
      response.statusCode = 500;
      response.source = `<html>
        <body>
          <div style="font-size:1.5rem">[Serverless-offline] ${message}:</div>
          <br/>
          <div>
            ${err.stack ? err.stack.replace(/(\r\n|\n|\r)/gm,'<br/>') : err.toString()}
          </div>
          <br/>
          <div>
            If you believe this is an issue with the plugin, please <a target="_blank" href="https://github.com/dherault/serverless-offline/issues">submit it</a>, thanks.
          </div>
        </body>
      </html>`;
      response.send();
    }
    
    _logAndExit() {
      for (let key in arguments) {
        console.log(arguments[key]);
      }
      process.exit(0);
    }
  };
};


