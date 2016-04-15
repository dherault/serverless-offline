'use strict';

module.exports = function reply500(response, message, err, requestId) {
  
  if (this._clearTimeout(requestId)) return;
  
  this.requests[requestId].done = true;
  
  const stackTrace = this._getArrayStackTrace(err.stack);
  
  log(message);
  console.log(stackTrace || err);
  
  response.statusCode = 200; // APIG replies 200 by default on failures
  response.source = {
    errorMessage: message,
    errorType: err.constructor.name,
    stackTrace,
    offlineInfo: 'If you believe this is an issue with the plugin please submit it, thanks. https://github.com/dherault/serverless-offline/issues',
  };
  log(`Replying error in handler`);
  response.send();
}