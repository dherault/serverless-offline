'use strict';

module.exports = function(ServerlessPlugin, serverlessPath) {

  require('coffee-script/register');

  const fs = require('fs');
  const path = require('path');
  const Hapi = require('hapi');
  const isPlainObject = require('lodash.isplainobject');
  
  const debugLog = require('./debugLog');
  const serverlessLog = require(path.join(serverlessPath, 'utils', 'cli')).log;
  
  const createLambdaContext = require('./createLambdaContext');
  const createVelocityContext = require('./createVelocityContext');
  const renderVelocityTemplateObject = require('./renderVelocityTemplateObject');

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
            description:  'Optional - The stage used to populate your velocity templates. Default: the first stage found in your project.'
          }, 
          {
            option:       'region',
            shortcut:     'r',
            description:  'Optional - The region used to populate your velocity templates. Default: the first region for the first stage found in your project.'
          }, 
          {
            option:       'skipRequireCacheInvalidation',
            shortcut:     'c',
            description:  'Optional - Tells the plugin to skip require cache invalidation. A script reloading tool like Nodemon might then be needed. Default: false.'
          }, 
          {
            option:       'httpsProtocol',
            shortcut:     'H',
            description:  'Optional - To enable HTTPS, specify directory for both cert.pem and key.pem files. Default: none.'
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
      
      // todo: check that the inputed stage and region exists
      this.options = {
        port: userOptions.port || 3000,
        prefix: userOptions.prefix || '/',
        stage: userOptions.stage || stagesKeys[0],
        skipRequireCacheInvalidation: userOptions.skipRequireCacheInvalidation || false,
        custom: state.project.custom['serverless-offline'],
        httpsProtocol: userOptions.httpsProtocol || '',
      };
      
      const stageVariables = stages[this.options.stage];
      this.options.region = userOptions.region || Object.keys(stageVariables.regions)[0];
      
      // Not really an option, but conviennient for latter use
      this.contextOptions = {
        stageVariables,
        stage: this.options.stage,
      };
      
      // Prefix must start and end with '/'
      if (!this.options.prefix.startsWith('/')) this.options.prefix = '/' + this.options.prefix;
      if (!this.options.prefix.endsWith('/')) this.options.prefix += '/';
      
      serverlessLog(`Starting Offline: ${this.options.stage}/${this.options.region}.`);
      debugLog('options:', this.options);
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
      
      const connectionOptions = { port: this.options.port };
      const httpsDir = this.options.httpsProtocol;
      
      if (typeof httpsDir === 'string' && httpsDir.length > 0) connectionOptions.tls = {
        key: fs.readFileSync(path.resolve(httpsDir, 'key.pem'), 'ascii'),
        cert: fs.readFileSync(path.resolve(httpsDir, 'cert.pem'), 'ascii')
      };
      
      this.server.connection(connectionOptions);
      
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
      const defaultContentType = 'application/json';
      
      functions.forEach(fun => {
        
        if (fun.getRuntime() !== 'nodejs') return;
        
        console.log();
        serverlessLog(`Routes for ${fun._config.sPath}:`);
        
        const funName = fun.name;
        const handlerParts = fun.handler.split('/').pop().split('.');
        const handlerPath = path.join(fun._config.fullPath, handlerParts[0]);
        const funTimeout = fun.timeout ? fun.timeout * 1000 : 6000;
        
        // Add a route for each endpoint
        fun.endpoints.forEach(ep => {
          
          let endpoint;
          let firstCall = true;
          
          try {
            endpoint = ep.getPopulated({
              stage: this.options.stage,
              region: this.options.region,
            });
          }
          catch(err) {
            serverlessLog(`Error while populating endpoint ${ep._config.sPath} with stage '${this.options.stage}' and region '${this.options.region}':`);
            this._logAndExit(err.stack);
          }
          
          // this._logAndExit(endpoint);
          
          const epath = endpoint.path;
          const method = endpoint.method.toUpperCase();
          const requestTemplates = endpoint.requestTemplates;
          
          // Prefix must start and end with '/' BUT path must not end with '/'
          let path = this.options.prefix + (epath.startsWith('/') ? epath.slice(1) : epath);
          if (path !== '/' && path.endsWith('/')) path = path.slice(0, -1);
          
          serverlessLog(`${method} ${path}`);
          
          // route configuration
          const config = { cors: true };
          // When no content-type is provided, APIG sets 'application/json'
          if (method !== 'GET' && method !== 'HEAD') config.payload = { override: defaultContentType };
          
          this.server.route({
            method, 
            path,
            config, 
            handler: (request, reply) => {
              console.log();
              serverlessLog(`${method} ${request.url.path} (λ: ${funName})`);
              if (firstCall) {
                serverlessLog('The first request might take a few extra seconds');
                firstCall = false;
              }
              
              // Holds the response to do async op
              const response = reply.response().hold();
              
              // First we try to load the handler
              
              let handler;
              try {
                if (!this.options.skipRequireCacheInvalidation) {
                  debugLog('Invalidating cache...');
                  
                  Object.keys(require.cache).forEach(key => {
                    // Require cache invalidation, brutal and fragile. Might cause errors, if so, please submit issue.
                    if (!key.match('node_modules')) delete require.cache[key];
                  }); 
                }
                
                debugLog(`Loading handler... (${handlerPath})`);
                handler = require(handlerPath)[handlerParts[1]];
                if (typeof handler !== 'function') throw new Error(`Serverless-offline: handler for function ${funName} is not a function`);
              } 
              catch(err) {
                return this._reply500(response, `Error while loading ${funName}`, err);
              }
              
              // The hanlder takes 2 args: event and context
              // We create the event object and attempt to apply the request template
              const contentType = request.mime || defaultContentType;
              const requestTemplate = requestTemplates[contentType];
              
              debugLog('contentType:', contentType);
              debugLog('requestTemplate:', requestTemplate);
              debugLog('payload:', request.payload);
              
              let event = {};
              
              if (!requestTemplate) {
                console.log();
                serverlessLog(`Warning: no template found for '${contentType}' content-type.`);
                console.log();
              } else {
                try {
                  debugLog('Populating event...');
                  const velocityContext = createVelocityContext(request, this.contextOptions, request.payload || {});
                  event = renderVelocityTemplateObject(requestTemplate, velocityContext);
                }
                catch (err) {
                  return this._reply500(response, `Error while parsing template "${contentType}" for ${funName}`, err);
                }
              }
              
              event.isOffline = true; 
              debugLog('event:', event);
              
              // We cannot use Hapijs's timeout feature because the logic above can take a significant time, so we implement it ourselves
              let timeoutTimeout; // It's a timeoutObject, for... timeout. timeoutTimeout ?
              
              // We create the context, it's callback (context.done/succeed/fail) sends the HTTP response
              const lambdaContext = createLambdaContext(fun, (err, result) => {
                
                if (timeoutTimeout._called) return;
                else clearTimeout(timeoutTimeout);
                
                let finalResponse;
                let finalResult;
                
                // Failure handling
                if (err) {
                  const errorMessage = err.message || err.toString();
                  
                  // Mocks Lambda errors
                  finalResult = { 
                    errorMessage,
                    errorType: err.constructor.name,
                    stackTrace: err.stack ? err.stack.split('\n') : null
                  };
                  
                  serverlessLog(`Failure: ${errorMessage}`);
                  if (err.stack) console.log(err.stack);
                  
                  Object.keys(endpoint.responses).forEach(key => {
                    if (finalResponse || key === 'default') return;
                    const x = endpoint.responses[key];
                    // I don't know why lambda choose to enforce the "starting with" condition on their regex
                    if (errorMessage.match('^' + (x.selectionPattern || key))) {
                      finalResponse = x;
                      debugLog(`Using response '${key}'`);
                    }
                  });
                }
                
                finalResponse = finalResponse || endpoint.responses['default'];
                finalResult = finalResult || result;
                
                // If there is a responseTemplates, we apply it to the finalResult
                const responseTemplates = finalResponse.responseTemplates;
                
                if (isPlainObject(responseTemplates)) {
                  // BAD IMPLEMENTATION: first key in responseTemplates
                  const templateName = Object.keys(responseTemplates)[0];
                  const responseTemplate = responseTemplates[templateName];
                  
                  if (responseTemplate) {
                    
                    /* Models implementation: */
                    // Load the models (Empty and Error from source, others fron user-defined dir...)
                    // Select correct model given in finalResponse
                    // evaluate velocity response template
                    // confront evaluation result with model...
                    // respond
                    /* ... */
                    
                    debugLog(`Using responseTemplate '${templateName}'`);
                    
                    try {
                      const reponseContext = createVelocityContext(request, this.options.contextOptions, finalResult);
                      finalResult = renderVelocityTemplateObject({ root: responseTemplate }, reponseContext).root;
                    }
                    catch (err) {
                      serverlessLog(`Error while parsing responseTemplate '${templateName}' for lambda ${funName}:`);
                      console.log(err.stack);
                    }
                  }
                }
                
                response.statusCode = finalResponse.statusCode;
                response.source = finalResult;
                
                let whatToLog = finalResult;
                
                try {
                  whatToLog = JSON.stringify(finalResult);
                } 
                catch(err) {
                  // nothing
                }
                finally {
                  serverlessLog(err ? `Replying ${finalResponse.statusCode}` : `[${finalResponse.statusCode}] ${whatToLog}`);
                }
                
                // Bon voyage!
                response.send();
              });
              
              timeoutTimeout = setTimeout(this._replyTimeout.bind(this, response, funName, funTimeout), funTimeout);
              
              // Finally we call the handler
              debugLog('Calling handler...');
              try {
                handler(event, lambdaContext);
              }
              catch(err) {
                return this._reply500(response, 'Uncaught error in your handler', err);
              }
            },
          });
        });
      });
    }
    
    _listen() {
      this.server.start(err => {
        if (err) throw err;
        console.log();
        serverlessLog(`Offline listening on ${this.options.httpsProtocol ? 'https' : 'http'}://localhost:${this.options.port}`);
      });
    }
    
    _reply500(response, message, err) {
      serverlessLog(message);
      console.log(err.stack || err);
      response.statusCode = 200; // APIG replies 200 by default on failures
      response.source = {
        errorMessage: message,
        errorType: err.constructor.name,
        stackTrace: err.stack ? err.stack.split('\n') : null,
        offlineInfo: 'If you believe this is an issue with the plugin please submit it, thanks. https://github.com/dherault/serverless-offline/issues',
      };
      response.send();
    }
    
    _replyTimeout(response, funName, funTimeout) {
      serverlessLog(`Replying timeout after ${funTimeout}ms`);
      response.statusCode = 503;
      response.source = `[Serverless-offline] Your λ handler ${funName} timed out after ${funTimeout}ms.`;
      response.send();
    }
    
    _logAndExit() {
      console.log(Object.keys(arguments).map((key, i, array) => array[key]));
      process.exit(0);
    }
  };
};
