'use strict';

const ac = require('./state/actionCreators');

const createApigContext = require('./createApigContext');
// const createLambdaContext = require('./createLambdaContext');
const createLambdaCallback = require('./createLambdaCallback');
const renderVelocityTemplateObject = require('./renderVelocityTemplateObject');

const reply500 = require('./reply500');

const log = require('./utils/log');
const logDebug = require('./utils/logDebug');

module.exports = function createRouteHandler(fun, endpoint, funOptions, noTimeout) {
  
  const funName = fun.name;
  const funTimeout = (fun.timeout || 6) * 1000;
  const method = endpoint.method.toUpperCase();
  const loadAndCallHandler = require(`runtimes/${fun.runtime}/loadAndCallHandler`);
    
  let isFirstCall = true;
  
  return (request, reply) => {
    
    // const state = store.getState();
    
    console.log();
    log(`${method} ${request.path} (λ: ${funName})`);
    if (isFirstCall) {
      log('The first request might take a few extra seconds');
      isFirstCall = false;
    }
    
    // Holds the response to do async op
    const requestId = request.id;
    const response = reply.response().hold();
    const contentType = request.mime || 'application/json';
    const requestTemplate = endpoint.requestTemplates[contentType];
    
    logDebug('requestId:', requestId);
    logDebug('contentType:', contentType);
    logDebug('requestTemplate:', requestTemplate);
    if (request.payload) logDebug('payload:', request.payload);
    
    /* BABEL CONFIGURATION */
    
    // TODO, rethink it
    // _registerBabel(funRuntime === 'babel', funBabelOptions);
    
    /* REQUEST TEMPLATE PROCESSING (event population) */
    
    let lambdaEvent = {};
    
    if (requestTemplate) {
      try {
        logDebug('_____ REQUEST TEMPLATE PROCESSING _____');
        // Velocity templating language parsing
        lambdaEvent = renderVelocityTemplateObject(requestTemplate, createApigContext(request, request.payload || {}));
        logDebug('end__ REQUEST TEMPLATE PROCESSING __end');
      }
      catch (err) {
        return reply500(response, `Error while parsing template '${contentType}' for '${funName}'`, err, requestId);
      }
    }
    
    lambdaEvent.isOffline = true; 
    logDebug('event:', lambdaEvent);
    
    // The Lambda callback is responsible for calling the HTTP response
    const lambdaCallback = createLambdaCallback();
    
    // We cannot use Hapijs's timeout feature because the logic above can take a significant time, so we implement it ourselves
    let timeout;
    if (!noTimeout) timeout = setTimeout(() => {
      // if (this.currentRequestId !== requestId) return; //TODO: test that shit
      log(`Replying timeout after ${funTimeout}ms`);
      
      ac.markRequestDone({ requestId });
      
      response.statusCode = 503;
      response.source = `[Serverless-Offline] Your λ handler '${funName}' timed out after ${funTimeout}ms.`;
      response.send();
    }, funTimeout);
    
    ac.createRequest({ requestId, timeout });
    
    // Finally we call the handler
    logDebug('_____ CALLING HANDLER _____');
    
    try {
      loadAndCallHandler(funName, funOptions.handlerPath, funOptions.handlerParts, lambdaEvent, lambdaCallback);
    } 
    catch(err) {
      return reply500(err, requestId, response);
    }
  };
};
