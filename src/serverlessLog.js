'use strict';

let log;

module.exports = function serverlessLog(...args) {
  log(...args);
};

module.exports.setLog = function setLog(serverlessLogRef) {
  log = serverlessLogRef;
};
