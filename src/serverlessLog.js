import boxen from 'boxen'
import chalk from 'chalk'

const { max } = Math

const dodgerblue = chalk.hex('#1e90ff')
const grey = chalk.hex('#808080')
const lime = chalk.hex('#00ff00')
const orange = chalk.hex('#ffa500')
const peachpuff = chalk.hex('#ffdab9')
const plum = chalk.hex('#dda0dd')
const red = chalk.hex('#ff0000')
const yellow = chalk.hex('#ffff00')

const colorMethodMapping = new Map([
  ['DELETE', red],
  ['GET', dodgerblue],
  // ['HEAD', ...],
  ['PATCH', orange],
  ['POST', plum],
  ['PUT', dodgerblue],
])

let log

export default function serverlessLog(msg) {
  if (log) {
    log(msg, 'offline')
  }
}

export function logLayers(msg) {
  console.log(`offline: ${dodgerblue(msg)}`)
}

export function setLog(serverlessLogRef) {
  log = serverlessLogRef
}

// logs based on:
// https://github.com/serverless/serverless/blob/master/lib/classes/CLI.js

function logRoute(method, server, path, maxLength, dimPath = false) {
  const methodColor = colorMethodMapping.get(method) ?? peachpuff
  const methodFormatted = method.padEnd(maxLength, ' ')

  return `${methodColor(methodFormatted)} ${yellow.dim('|')} ${grey.dim(
    server,
  )}${dimPath ? grey.dim(path) : lime(path)}`
}

function getMaxHttpMethodNameLength(routeInfo) {
  return max(...routeInfo.map(({ method }) => method.length))
}

export function logRoutes(routeInfo) {
  const boxenOptions = {
    borderColor: 'yellow',
    dimBorder: true,
    margin: 1,
    padding: 1,
  }
  const maxLength = getMaxHttpMethodNameLength(routeInfo)

  console.log(
    boxen(
      routeInfo
        .map(
          ({ method, path, server, invokePath }) =>
            // eslint-disable-next-line prefer-template
            logRoute(method, server, path, maxLength) +
            '\n' +
            logRoute('POST', server, invokePath, maxLength, true),
        )
        .join('\n'),
      boxenOptions,
    ),
  )
}

export function logWarning(msg) {
  console.log(`offline: ${red(msg)}`)
}
