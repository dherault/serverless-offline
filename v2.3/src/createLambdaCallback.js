'use strict';

(err, data) => {
  // Everything in this block happens once the lambda function has resolved
  logDebug('_____ HANDLER RESOLVED _____');
  
  // Timeout clearing if needed
  if (_clearTimeout(requestId)) return;
  
  // User should not call context.done twice
  if (requests[requestId].done) {
    console.log();
    log(`Warning: context.done called twice within handler '${funName}'!`);
    logDebug('requestId:', requestId);
    return;
  }
  
  requests[requestId].done = true;
  
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
      stackTrace: _getArrayStackTrace(err.stack)
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
          const reponseContext = createApigContext(request, velocityContextOptions, result);
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
};
