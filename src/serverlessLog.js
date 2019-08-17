'use strict'

const chalk = require('chalk')

let log

module.exports = function serverlessLog(msg) {
  log(msg, 'offline')
}

module.exports.setLog = function setLog(serverlessLogRef) {
  log = serverlessLogRef
}

// logs based on:
// https://github.com/serverless/serverless/blob/master/lib/classes/CLI.js

module.exports.errorLog = function errorLog(msg) {
  console.log()
  console.log(`offline: ${chalk.keyword('red')(msg)}`)
  console.log()
}

module.exports.logRoute = function logRoute(httpMethod, server, path) {
  console.log(
    `offline: ${chalk.keyword('dodgerblue')(`[${httpMethod}]`)} ${chalk
      .keyword('grey')
      .dim(`${server}`)}${chalk.keyword('lime')(path)}`,
  )
}
