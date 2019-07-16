'use strict';

module.exports = require('./ServerlessOffline.js');

// Serverless exits with code 1 when a promise rejection is unhandled. Not AWS.
// Users can still use their own unhandledRejection event though.
process.removeAllListeners('unhandledRejection');
