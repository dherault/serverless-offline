import chalk from 'chalk'

let log

export default function serverlessLog(msg) {
  if (log) {
    log(msg, 'offline')
  }
}

export function setLog(serverlessLogRef) {
  log = serverlessLogRef
}

// logs based on:
// https://github.com/serverless/serverless/blob/master/lib/classes/CLI.js

export function logRoute(httpMethod, server, path) {
  console.log(
    `offline: ${chalk.keyword('dodgerblue')(`[${httpMethod}]`)} ${chalk
      .keyword('grey')
      .dim(`${server}`)}${chalk.keyword('lime')(path)}`,
  )
}

export function logWarning(msg) {
  console.log(`offline: ${chalk.keyword('red')(msg)}`)
}
