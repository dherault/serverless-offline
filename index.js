'use strict';

module.exports = function(ServerlessPlugin, serverlessPath) {
  
  const path = require('path');
  const context = require(path.join(serverlessPath, 'utils', 'context'));
  const SCli = require(path.join(serverlessPath, 'utils', 'cli'));
  const SUtils = require(path.join(serverlessPath, 'utils'));
  const Hapi = require('hapi');

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
      
      this.server = new Hapi.Server();
      this.port = this.evt.port || 3000;
      
      this.server.connection({ 
        port: this.port
      });
      
      let prefix = this.evt.prefix || '/';
      
      if (!prefix.startsWith('/')) prefix = '/' + prefix;
      if (!prefix.endsWith('/')) prefix += '/';
      
      this.prefix = prefix;
      
      return Promise.resolve();
    }
    
    _registerLambdas() {
      const functions = this.S.state.getFunctions();
      
      functions.forEach(fun => {
        
        if (fun.getRuntime() !== 'nodejs') return;
        
        const handlerParts = fun.handler.split('/').pop().split('.');
        const handlerPath = path.join(fun._config.fullPath, handlerParts[0] + '.js');
        
        
        fun.endpoints.forEach(endpoint => {
          // const { method, path } = endpoint;
          const method = endpoint.method;
          const epath = endpoint.path;
          const path = this.prefix + (epath.startsWith('/') ? epath.slice(1) : epath);
          
          if(process.env.DEBUG) SCli.log(`Route: ${method} ${path}`);
          
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
                SCli.log(`Error while loading ${handlerPath}: ${err}`);
                throw err ;
              }
              
              const event = Object.assign({ isServerlessOffline: true }, request);
              
              handler(event, context(fun.name, (err, result) => {
                let finalResponse;
                let finalResult;
                
                const responsesKeys = Object.keys(endpoint.responses);
                
                if (err) {
                  finalResult = { errorMessage: err };
                  const errString = err.toString();
                  
                  responsesKeys.forEach(key => {
                    const x = endpoint.responses[key];
                    if (!finalResponse && key !== 'default' && x.selectionPattern && errString.match(x.selectionPattern)) {
                      finalResponse = x;
                    }
                  });
                }
                
                finalResponse = finalResponse || endpoint.responses['default'];
                finalResult = finalResult || result;
                
                serverResponse.statusCode = finalResponse.statusCode;
                serverResponse.source = finalResult;
                
                SCli.log(`[${finalResponse.statusCode}] ${finalResult}`);
                
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
        // .then(() =>this.evt);
    }
  };
};
