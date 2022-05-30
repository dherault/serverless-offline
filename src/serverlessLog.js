import boxen from 'boxen'
import chalk from 'chalk'

const { max } = Math

const blue = chalk.hex('#1e90ff') // dodgerblue
const grey = chalk.hex('#808080') // grey
const lime = chalk.hex('#00ff00') // lime
const orange = chalk.hex('#ffa500') // orange
const peachpuff = chalk.hex('#ffdab9') // peachpuff
const plum = chalk.hex('#dda0dd') // plum
const red = chalk.hex('#ff0000') // red
const yellow = chalk.hex('#ffff00') // yellow

const colorMethodMapping = new Map([
  ['DELETE', red],
  ['GET', blue],
  // ['HEAD', ...],
  ['PATCH', orange],
  ['POST', plum],
  ['PUT', blue],
])

let log

export default function serverlessLog(msg) {
  if (log) {
    log(msg, 'offline')
  }
}

export function logLayers(msg) {
  console.log(`offline: ${blue(msg)}`)
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
