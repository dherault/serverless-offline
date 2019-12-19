import boxen from 'boxen'
import chalk from 'chalk'

const { max } = Math

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

function logRoute(httpMethod, server, stage, path, maxLength) {
  return `${chalk.keyword('dodgerblue')(
    `${httpMethod.padEnd(maxLength, ' ')} |`,
  )} ${chalk.keyword('grey').dim(`${server}/${stage}`)}${chalk.keyword('lime')(
    path,
  )}`
}

function getMaxHttpMethodNameLength(routeInfo) {
  return max(...routeInfo.map(({ method }) => method.length))
}

export function logRoutes(routeInfo) {
  const maxLength = getMaxHttpMethodNameLength(routeInfo)
  const boxenOptions = {
    borderColor: 'yellow',
    dimBorder: true,
    margin: 1,
    padding: 1,
  }

  console.log(
    boxen(
      routeInfo
        .map(({ method, path, server, stage }) =>
          logRoute(method, server, stage, path, maxLength),
        )
        .join('\n'),
      boxenOptions,
    ),
  )
}

export function logWarning(msg) {
  console.log(`offline: ${chalk.keyword('red')(msg)}`)
}
