'use strict';

module.exports = function(ServerlessPlugin, serverlessPath) {
  
  const path = require('path');
  const Hapi = require('hapi');
  // const SUtils = require(path.join(serverlessPath, 'utils'));
  const SCli = require(path.join(serverlessPath, 'utils', 'cli'));
  const context = require(path.join(serverlessPath, 'utils', 'context'));

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
        options:       [{
          option:      'prefix',
          shortcut:    'p',
          description: 'Optional - Add a URL prefix to each simulated API Gateway ressource'
        }, {
          option:      'port',
          shortcut:    'P',
          description: 'Optional - HTTP port to use, default: 3000'
        }]
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
        
        const handlerParts = fun.handler.split('/').pop().split('.');
        const handlerPath = path.join(fun._config.fullPath, handlerParts[0] + '.js');
        
        // Add a route for each endpoint
        fun.endpoints.forEach(endpoint => {
          
          const method = endpoint.method;
          const epath = endpoint.path;
          
          // Prefix must start and end with '/' BUT path must not end with '/'
          let path = this.prefix + (epath.startsWith('/') ? epath.slice(1) : epath);
          if (path.endsWith('/')) path = path.slice(0, -1);
          
          SCli.log(`Route: ${method} ${path}`);
          
          this.server.route({
            method, 
            path,
            config: { cors: true }, 
            handler: (request, reply) => {
              SCli.log(`Serving: ${method} ${request.url.path}`);
              
              const serverResponse = reply.response().hold();
              
              let handler;
              try {
                handler = require(handlerPath)[handlerParts[1]];
              } catch(err) {
                SCli.log(`Error while loading ${fun.name}`);
                console.log(err.stack || err);
                serverResponse.statusCode = 500;
                serverResponse.source = `<html>
                  <body>
                    <div>[Serverless-offline] An error occured when loading <strong>${fun.name}</strong>:</div>
                    <br/>
                    <div>
                      ${err.stack ? err.stack.replace(/(\r\n|\n|\r)/gm,'<br/>') : err.toString()}
                    </div>
                  </body>
                </html>`;
                serverResponse.send();
                return;
              }
              
              const event = Object.assign({ isServerlessOffline: true }, request);
              
              // Call the handler
              handler(event, context(fun.name, (err, result) => {
                let finalResponse;
                let finalResult;
                
                const responsesKeys = Object.keys(endpoint.responses);
                
                // Error handling
                if (err) {
                  const errorMessage = err.message || err.toString();
                  
                  finalResult = { 
                    errorMessage,
                    errorType: err.constructor.name,
                    stackTrace: err.stack ? err.stack.split('\n') : null
                  };
                  
                  SCli.log(`Error: ${errorMessage}`);
                  if (err.stack) console.log(err.stack);
                  
                  
                  responsesKeys.forEach(key => {
                    const x = endpoint.responses[key];
                    if (!finalResponse && key !== 'default' && x.selectionPattern && errorMessage.match(x.selectionPattern)) {
                      finalResponse = x;
                    }
                  });
                  
                  if (!finalResponse) finalResponse = { statusCode: 500 };
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
                
                SCli.log(`[${finalResponse.statusCode}] ${whatToLog}`);
                
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
        SCli.log(`Serverless offline listening on http://localhost:${this.port}`);
      });
    }
    
    _registerBabel() {
      return new this.S.classes.Project(this.S).load().then(project => { // Promise to load project
        const custom = project.custom['serverless-offline'];
        
        if (custom && custom.babelOptions) require('babel-register')(custom.babelOptions);
      });
    }
    
    start(evt) {
      
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
