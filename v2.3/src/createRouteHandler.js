'use strict';

const isPlainObject = require('lodash.isplainobject');

const store = require('./state/store');
const ac = require('./state/actionCreators');
const log = require('./utils/log');
const logDebug = require('./utils/logDebug');

module.exports = function createRouteHandler(fun, endpoint, options) {
  
  const funName = fun.name;
  const funEnvironment = isPlainObject(fun.environment) ? fun.environment : {};
  const method = endpoint.method.toUpperCase();
  const defaultContentType = 'application/json';
  
  let firstCall = true;
  
  return (request, reply) => {
    
    const state = store.getState();
    
    console.log();
    log(`${method} ${request.path} (λ: ${funName})`);
    if (firstCall) {
      log('The first request might take a few extra seconds');
      firstCall = false;
    }
    
    // Shared mutable state is the root of all evil they say
    const requestId = Math.random().toString().slice(2);
    this.requests[requestId] = { done: false };
    this.currentRequestId = requestId;
    
    // Holds the response to do async op
    const response = reply.response().hold();
    const contentType = request.mime || defaultContentType;
    const requestTemplate = endpoint.requestTemplates[contentType];
    
    logDebug('requestId:', requestId);
    logDebug('contentType:', contentType);
    logDebug('requestTemplate:', requestTemplate);
    if (request.payload) logDebug('payload:', request.payload);
    
    /* ENVIRONMENT VARIABLES DECLARATION */
    
    // Clears old vars
    for (let key in this.envVars) {
      delete process.env[key];
    }
    
    // Declares new ones
    this.envVars = isPlainObject(funEnvironment) ? funEnvironment : {};
    for (let key in this.envVars) {
      process.env[key] = this.envVars[key];
    }
    
    /* BABEL CONFIGURATION */
    
    this._registerBabel(funRuntime === 'babel', funBabelOptions);
    
    /* HANDLER LAZY LOADING */
    
    let handler; // The lambda function
    
    try {
      if (!this.options.skipCacheInvalidation) {
        logDebug('Invalidating cache...');
        
        for (let key in require.cache) {
          // Require cache invalidation, brutal and fragile. 
          // Might cause errors, if so please submit an issue.
          if (!key.match('node_modules')) delete require.cache[key];
        }
      }
      
      logDebug(`Loading handler... (${handlerPath})`);
      handler = require(handlerPath)[handlerParts[1]];
      if (typeof handler !== 'function') throw new Error(`Serverless-offline: handler for '${funName}' is not a function`);
    } 
    catch(err) {
      return this._reply500(response, `Error while loading ${funName}`, err, requestId);
    }
    
    /* REQUEST TEMPLATE PROCESSING (event population) */
    
    let event = {};
    
    if (requestTemplate) {
      try {
        logDebug('_____ REQUEST TEMPLATE PROCESSING _____');
        // Velocity templating language parsing
        const velocityContext = createVelocityContext(request, this.velocityContextOptions, request.payload || {});
        event = renderVelocityTemplateObject(requestTemplate, velocityContext);
      }
      catch (err) {
        return this._reply500(response, `Error while parsing template "${contentType}" for ${funName}`, err, requestId);
      }
    }
    
    event.isOffline = true; 
    logDebug('event:', event);
    
    // We create the context, its callback (context.done/succeed/fail) will send the HTTP response
    const lambdaContext = createLambdaContext(fun, (err, data) => {
      // Everything in this block happens once the lambda function has resolved
      logDebug('_____ HANDLER RESOLVED _____');
      
      // Timeout clearing if needed
      if (this._clearTimeout(requestId)) return;
      
      // User should not call context.done twice
      if (this.requests[requestId].done) {
        console.log();
        log(`Warning: context.done called twice within handler '${funName}'!`);
        logDebug('requestId:', requestId);
        return;
      }
      
      this.requests[requestId].done = true;
      
      let result = data;
      let responseName = 'default';
      let responseContentType = defaultContentType;
      
      /* RESPONSE SELECTION (among endpoint's possible responses) */
      
      // Failure handling
      if (err) {
        
        const errorMessage = (err.message || err).toString();
        
        // Mocks Lambda errors
        result = { 
          errorMessage,
          errorType: err.constructor.name,
          stackTrace: this._getArrayStackTrace(err.stack)
        };
        
        log(`Failure: ${errorMessage}`);
        if (result.stackTrace) console.log(result.stackTrace.join('\n  '));
        
        for (let key in endpoint.responses) {
          if (key === 'default') continue;
          
          if (errorMessage.match('^' + (endpoint.responses[key].selectionPattern || key) + '$')) {
            responseName = key;
            break;
          }
        }
      }
      
      logDebug(`Using response '${responseName}'`);
      
      const chosenResponse = endpoint.responses[responseName];
      
      /* RESPONSE PARAMETERS PROCCESSING */
      
      const responseParameters = chosenResponse.responseParameters;
      
      if (isPlainObject(responseParameters)) {
        
        const responseParametersKeys = Object.keys(responseParameters);
        
        logDebug('_____ RESPONSE PARAMETERS PROCCESSING _____');
        logDebug(`Found ${responseParametersKeys.length} responseParameters for '${responseName}' response`);
        
        responseParametersKeys.forEach(key => {
          
          // responseParameters use the following shape: "key": "value"
          const value = responseParameters[key];
          const keyArray = key.split('.'); // eg: "method.response.header.location"
          const valueArray = value.split('.'); // eg: "integration.response.body.redirect.url"
          
          logDebug(`Processing responseParameter "${key}": "${value}"`);
          
          // For now the plugin only supports modifying headers
          if (key.startsWith('method.response.header') && keyArray[3]) {
            
            const headerName = keyArray.slice(3).join('.');
            let headerValue;
            logDebug('Found header in left-hand:', headerName);
            
            if (value.startsWith('integration.response')) {
              if (valueArray[2] === 'body') {
                
                logDebug('Found body in right-hand');
                headerValue = JSON.stringify(valueArray[3] ? jsonPath(result, valueArray.slice(3).join('.')) : result);
                
              } else {
                console.log();
                log(`Warning: while processing responseParameter "${key}": "${value}"`);
                log(`Offline plugin only supports "integration.response.body[.JSON_path]" right-hand responseParameter. Found "${value}" instead. Skipping.`);
                logPluginIssue();
                console.log();
              }
            } else {
              headerValue = value;
            }
            // Applies the header;
            logDebug(`Will assign "${headerValue}" to header "${headerName}"`);
            response.header(headerName, headerValue);
          } 
          else {
            console.log();
            log(`Warning: while processing responseParameter "${key}": "${value}"`);
            log(`Offline plugin only supports "method.response.header.PARAM_NAME" left-hand responseParameter. Found "${key}" instead. Skipping.`);
            logPluginIssue();
            console.log();
          }
        });
      }
      
      /* RESPONSE TEMPLATE PROCCESSING */
      
      // If there is a responseTemplate, we apply it to the result
      const responseTemplates = chosenResponse.responseTemplates;
      
      if (isPlainObject(responseTemplates)) {
        
        const responseTemplatesKeys = Object.keys(responseTemplates);
        
        if (responseTemplatesKeys.length) {
          
          // BAD IMPLEMENTATION: first key in responseTemplates
          const templateName = responseTemplatesKeys[0];
          const responseTemplate = responseTemplates[templateName];
          
          responseContentType = templateName;
          
          if (responseTemplate) {
            
            logDebug('_____ RESPONSE TEMPLATE PROCCESSING _____');
            logDebug(`Using responseTemplate '${templateName}'`);
            
            try {
              const reponseContext = createVelocityContext(request, this.velocityContextOptions, result);
              result = renderVelocityTemplateObject({ root: responseTemplate }, reponseContext).root;
            }
            catch (err) {
              log(`Error while parsing responseTemplate '${templateName}' for λ ${funName}:`);
              console.log(err.stack);
            }
          }
        }
      }
      
      /* HAPIJS RESPONSE CONFIGURATION */
      
      const statusCode = chosenResponse.statusCode || 200;
      if (!chosenResponse.statusCode) {
        console.log();
        log(`Warning: No statusCode found for response "${responseName}".`);
      }
      
      response.header('Content-Type', responseContentType);
      response.statusCode = statusCode;
      response.source = result;
      
      // Log response
      let whatToLog = result;
      
      try {
        whatToLog = JSON.stringify(result);
      } 
      catch(err) {
        // nothing
      }
      finally {
        log(err ? `Replying ${statusCode}` : `[${statusCode}] ${whatToLog}`);
        logDebug('requestId:', requestId);
      }
      
      // Bon voyage!
      response.send();
    });
    
    // Now we are outside of createLambdaContext, so this happens before the handler gets called:
    
    // We cannot use Hapijs's timeout feature because the logic above can take a significant time, so we implement it ourselves
    this.requests[requestId].timeout = setTimeout(this._replyTimeout.bind(this, response, funName, funTimeout, requestId), funTimeout);
    
    // Finally we call the handler
    logDebug('_____ CALLING HANDLER _____');
    try {
      const x = handler(event, lambdaContext, lambdaContext.done);
      
      // Promise support
      if (funRuntime === 'babel' && !this.requests[requestId].done) {
        if (x && typeof x.then === 'function' && typeof x.catch === 'function') x
          .then(lambdaContext.succeed)
          .catch(lambdaContext.fail);
        else if (x instanceof Error) lambdaContext.fail(x);
        else lambdaContext.succeed(x);
      }
    }
    catch(err) {
      return this._reply500(response, `Uncaught error in your '${funName}' handler`, err, requestId);
    }
  };
};
