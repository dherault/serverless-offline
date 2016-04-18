'use strict';

module.exports = S => {
  
  // One-line coffee-script support
  require('coffee-script/register');
  
  // Node dependencies
  const fs = require('fs');
  const path = require('path');
  
  // External dependencies
  const Hapi = require('hapi');
  // const isPlainObject = require('lodash.isplainobject');
  
  // Internal lib
  const config = require('./config');
  
  const store = require('./state/store');
  const ac = require('./state/actionCreators');
  
  const log = require('./utils/log');
  const logDebug = require('./utils/logDebug');
  const logWarning = require('./utils/logWarning');
  const logAndExit = require('./utils/logAndExit');
  
  // const jsonPath = require('./jsonPath');
  const createRouteHandler = require('./createRouteHandler');
  // const createVelocityContext = require('./createVelocityContext');
  // const renderVelocityTemplateObject = require('./renderVelocityTemplateObject');
  
  function logPluginIssue() {
    log('If you think this is an issue with the plugin please submit it, thanks!');
    log('https://github.com/dherault/serverless-offline/issues');
  }
  
  return class Offline extends S.classes.Plugin {
    
    static getName() {
      return 'serverless-offline';
    }
    
    registerActions() {
      S.addAction(this.start.bind(this), {
        context:       'offline', // calling 'sls offline'
        contextAction: 'start',   // followed by 'start'
        handler:       'start',   // will invoke the start method
        description:   'Simulates API Gateway to call your lambda functions offline',
        options:       [
          {
            option:      'prefix',
            shortcut:    'p',
            description: 'Adds a prefix to every path, to send your requests to http://localhost:3000/prefix/[your_path] instead.'
          }, 
          {
            option:      'port',
            shortcut:    'P',
            description: 'Port to listen on. Default: 3000'
          }, 
          {
            option:       'stage',
            shortcut:     's',
            description:  'The stage used to populate your templates. Default: the first stage found in your project'
          }, 
          {
            option:       'region',
            shortcut:     'r',
            description:  'The region used to populate your templates. Default: the first region for the first stage found.'
          }, 
          {
            option:       'skipCacheInvalidation',
            shortcut:     'c',
            description:  'Tells the plugin to skip require cache invalidation. A script reloading tool like Nodemon might then be needed'
          }, 
          {
            option:       'httpsProtocol',
            shortcut:     'H',
            description:  'To enable HTTPS, specify directory (relative to your cwd, typically your project dir) for both cert.pem and key.pem files.'
          }, 
          {
            option:       'noTimeout',
            shortcut:     't',
            description:  'Disable the timeout feature.'
          }
        ]
      });
      return Promise.resolve();
    }
    
    registerHooks() {
      return Promise.resolve();
    }
    
    // Entry point for the plugin (sls offline start)
    start() {
      
      // Serverless version checking
      if (!S._version.startsWith(config.supportedServerlessVersion)) logAndExit(`Offline requires Serverless v0.5.x but found ${S._version}. Exiting.`);
      
      // Internals
      process.env.IS_OFFLINE = true;  // Some users would like to know their environment outside of the handler
      this.project = S.getProject();  // All the project data
      // this.requests = {};             // Maps a request id to the request's state (done: bool, timeout: timer)
      // this.envVars = {};              // Env vars are specific to each handler
      
      // Methods
      this._setOptions();     // Will create meaningful options from cli options
      // this._registerBabel();  // Support for ES6
      this._createServer();   // Hapijs boot
      this._createRoutes();   // API  Gateway emulation
      this._create404Route(); // Not found handling
      this._listen();         // Hapijs listen
    }
    
    _setOptions() {
      
      if (!S.cli || !S.cli.options) logAndExit('Offline could not load options from Serverless');
      
      const userOptions = S.cli.options;
      const stages = this.project.stages;
      const stagesKeys = Object.keys(stages);
      
      if (!stagesKeys.length) logAndExit('Offline could not find a default stage for your project: it looks like your _meta folder is empty. Try "sls project init" to recreate your _meta folder.');
      
      // Applies defaults
      const options = {
        port: userOptions.port || 3000,
        prefix: userOptions.prefix || '/',
        stage: userOptions.stage || stagesKeys[0],
        noTimeout: userOptions.noTimeout || false,
        httpsProtocol: userOptions.httpsProtocol || '',
        skipCacheInvalidation: userOptions.skipCacheInvalidation || false,
      };
      
      options.stageVariables = stages[options.stage];
      options.region = userOptions.region || Object.keys(options.stageVariables.regions)[0];
      
      // Prefix must start and end with '/'
      if (!options.prefix.startsWith('/')) options.prefix = '/' + options.prefix;
      if (!options.prefix.endsWith('/')) options.prefix += '/';
      
      // Extracts babel configuration from s-project.json
      options.globalBabelOptions = ((this.project.custom || {})['serverless-offline'] || {}).babelOptions;
      
      // Passes options to this and store
      this.options = options;
      store.dispatch(ac.setOptions(options));
      
      log(`Starting Offline: ${options.stage}/${options.region}.`);
      logDebug('options:', options);
    }
    
    _createServer() {
      
      // Hapijs server creation
      this.server = new Hapi.Server({
        connections: {
          router: {
            stripTrailingSlash: true // removes trailing slashes on incoming paths.
          }
        }
      });
      
      const connectionOptions = { port: this.options.port };
      const httpsDir = this.options.httpsProtocol;
      
      // HTTPS support
      if (typeof httpsDir === 'string' && httpsDir.length > 0) connectionOptions.tls = {
        key: fs.readFileSync(path.resolve(httpsDir, 'key.pem'), 'ascii'),
        cert: fs.readFileSync(path.resolve(httpsDir, 'cert.pem'), 'ascii')
      };
      
      // Passes the configuration object to the server
      this.server.connection(connectionOptions);
    }
    
    _createRoutes() {
      
      this.project.getAllFunctions().forEach(fun => {
        
        const funName = fun.name;
        const funRuntime = fun.runtime;
        
        // Runtime checks
        if (config.supportedRuntimes.indexOf(funRuntime) === -1) return logWarning(`Found unsupported runtime '${funRuntime}' for function '${funName}'`);
        
        // Templates population (with project variables)
        let populatedFun;
        try {
          populatedFun = fun.toObjectPopulated({
            stage: this.options.stage,
            region: this.options.region,
          });
        }
        catch(err) {
          log(`Error while populating function '${funName}' with stage '${this.options.stage}' and region '${this.options.region}':`);
          logAndExit(err.stack);
        }
        
        const handlerParts = fun.handler.split('/').pop().split('.');
        const funOptions = {
          handlerName: handlerParts[1],
          handlerPath: fun.getRootPath(handlerParts[0]),
          babelOptions: ((populatedFun.custom || {}).runtime || {}).babel,
        };
        
        
        console.log();
        log(`Routes for ${funName}:`);
        logDebug('Runtime:', funRuntime, funOptions.babelOptions || '');
        
        // Adds a route for each endpoint
        populatedFun.endpoints.forEach(endpoint => {
          
          const ePath = endpoint.path;
          const method = endpoint.method.toUpperCase();
          
          // Path must not end with '/'
          let path = this.options.prefix + (ePath.startsWith('/') ? ePath.slice(1) : ePath);
          if (path !== '/' && path.endsWith('/')) path = path.slice(0, -1);
          
          log(`${method} ${path}`);
          
          // Route configuration
          const config = { cors: true }; // TODO: suppr var
          // When no content-type is provided on incomming requests, APIG sets 'application/json'
          // TODO: test that shit
          // if (method !== 'GET' && method !== 'HEAD') config.payload = { override: 'application/json' };
          
          this.server.route({
            method, 
            path,
            config, 
            handler: createRouteHandler(populatedFun, endpoint, funOptions, this.options.noTimeout),
          });
        });
      });
    }
    
    // All done, we can listen to incomming requests
    _listen() {
      this.server.start(err => {
        if (err) throw err;
        console.log();
        log(`Offline listening on http${this.options.httpsProtocol ? 's' : ''}://localhost:${this.options.port}`);
      });
    }
    
    _clearTimeout(requestId) {
      const timeout = this.requests[requestId].timeout;
      if (timeout && timeout._called) return true;
      else clearTimeout(timeout);
    }
    
    _create404Route() {
      this.server.route({
        method: '*',
        path: '/{p*}',
        config: { cors: true },
        handler: (request, reply) => {
          const response = reply({
            statusCode: 404,
            error: 'Serverless-offline: route not found.',
            currentRoute: `${request.method} - ${request.path}`,
            existingRoutes: this.server.table()[0].table
              .filter(route => route.path !== '/{p*}') // Exclude this (404) route
              .sort((a, b) => a.path <= b.path ? -1 : 1) // Sort by path
              .map(route => `${route.method} - ${route.path}`), // Human-friendly result
          });
          response.statusCode = 404;
        }
      });
    }
  };
};
