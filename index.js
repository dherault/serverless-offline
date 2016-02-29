'use strict';

module.exports = function(ServerlessPlugin, serverlessPath) {
  
  const path = require('path');
  const Hapi = require('hapi');
  const fs = require('fs');
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
            option: 'protocol',
            shortcut: 's',
            description: 'Optional - For HTTPS, specify directory for both cert.pem and key.pem files .eg "-s ../"'
          }, 
          {
            option:      'port',
            shortcut:    'P',
            description: 'Optional - HTTP port to use, default: 3000'
          }, 
          {
            option:       'useTemplates',
            shortcut:     't',
            description:  'Optional - Experimental feature: use your templates to populate the event object passed to your λ'
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
      
      if(this.evt.protocol && this.evt.protocol.length > 0){

        var tls = {
          key: fs.readFileSync(path.join(__dirname,this.evt.protocol, 'key.pem'), 'ascii'),
          cert: fs.readFileSync(path.join(__dirname,this.evt.protocol, 'cert.pem'), 'ascii')
        };

        this.server.connection({ 
          port: this.port,
          tls: tls 
        });
      } else {
        this.server.connection({ port: this.port });        
      }
      
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
        const timeout = fun.timeout ? fun.timeout * 1000 : 6000;
        
        // Add a route for each endpoint
        fun.endpoints.forEach(endpoint => {
          
          const method = endpoint.method;
          const epath = endpoint.path;
          // const requestParams = endpoint.requestParameters;
          const requestTemplates = endpoint.requestTemplates;
          
          // Prefix must start and end with '/' BUT path must not end with '/'
          let path = this.prefix + (epath.startsWith('/') ? epath.slice(1) : epath);
          if (path !== '/' && path.endsWith('/')) path = path.slice(0, -1);
          
          SCli.log(`Route: ${method} ${path}`);
          
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
              SCli.log(`Serving: ${method} ${request.url.path}`);
              
              const serverResponse = reply.response().hold();
              
              // First we try to load the handler
              let handler;
              try {
                Object.keys(require.cache).forEach(key => {
                  // Require cache invalidation, slow and brutal
                  if (!key.match('babel')) delete require.cache[key];
                }); 
                handler = require(handlerPath)[handlerParts[1]];
                if (!handler || typeof handler !== 'function') throw new Error(`Serverless-offline: handler for function ${fun.name} is not a function`);
              } 
              catch(err) {
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
              
              // Then we create the event object
              const event = Object.assign({ isServerlessOffline: true }, request);
              
              if (requestTemplates && this.evt.useTemplates) {
                // Apply request template to event
                const mime = request.mime || 'application/json';
                if (mime in requestTemplates) {
                  try {
                    const requestTemplate = requestTemplates[mime];

                    // TODO: proces $context variables in a more complete way http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#context-variable-reference
                    // TODO: $input could also be dealt with in a more robust way http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#input-variable-reference
                    for (let key in requestTemplate) {
                      
                      if (requestTemplate[key] === '$context.httpMethod') {
                        event[key] = request.method.toUpperCase();
                      } else if (requestTemplate[key] === '$input.params()') {
                        event[key] = request.params;
                      } else {
                        const reResp = reInputParam.exec(requestTemplate[key]);
                        if (reResp) {
                          // lookup variable replacement in params
                          const paramName = reResp[1];
                          event[key] = paramName in event.params ? event.params[paramName] : '';
                        }
                        else {
                          event[key] = requestTemplate[key];
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
        var protocol = (this.evt.protocol && this.evt.protocol.length > 0) ? 'https' : 'http';
        SCli.log('Offline listening on '+ protocol +'://localhost:' + this.port);
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