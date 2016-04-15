'use strict';

module.exports = function reply503(response, funName, funTimeout, requestId) {
  if (this.currentRequestId !== requestId) return;
  
  this.requests[requestId].done = true;
  
  log(`Replying timeout after ${funTimeout}ms`);
  response.statusCode = 503;
  response.source = `[Serverless-Offline] Your λ handler '${funName}' timed out after ${funTimeout}ms.`;
  response.send();
};
