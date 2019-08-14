'use strict'

let log

module.exports = function serverlessLog(msg) {
  log(msg, 'offline')
}

module.exports.setLog = function setLog(serverlessLogRef) {
  log = serverlessLogRef
}
