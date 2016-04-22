'use strict';

const log = require('./utils/log');
const getArrayStackTrace = require('./utils/getArrayStackTrace');
const markRequestDone = require('./state/actionCreators').markRequestDone;

module.exports = function reply500(err, requestId, response) {
  
  // if (this._clearTimeout(requestId)) return; TODO: test that shit
  markRequestDone({ requestId });
  
  const message = err.offlineMessage || 'Internal Server Error';
  const stackTrace = getArrayStackTrace(err.stack);
  
  log(message);
  console.log(stackTrace ? stackTrace.join('\n  ') : err);
  
  response.statusCode = 200; // APIG replies 200 by default on failures
  response.source = {
    errorMessage: message,
    errorType: err.constructor.name,
    stackTrace,
    offlineInfo: 'If you believe this is an issue with the plugin please submit it, thanks. https://github.com/dherault/serverless-offline/issues',
  };
  log(`Replying error in handler`);
  response.send();
};
