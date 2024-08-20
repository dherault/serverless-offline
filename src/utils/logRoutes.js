import boxen from "boxen"
import {
  dodgerblue,
  gray,
  lime,
  orange,
  peachpuff,
  plum,
  red,
  yellow,
} from "../config/colors.js"

const post = "POST"
const colorMethodMapping = new Map([
  ["DELETE", red],
  ["GET", dodgerblue],
  // ['HEAD', ...],
  ["PATCH", orange],
  ["POST", plum],
  ["PUT", dodgerblue],
])

// logs based on:
// https://github.com/serverless/serverless/blob/master/lib/classes/CLI.js

function logRoute(method, server, path, maxLength, dimPath = false) {
  const methodColor = colorMethodMapping.get(method) ?? peachpuff
  const methodFormatted = method.padEnd(maxLength, " ")

  return `${methodColor(methodFormatted)} ${yellow.dim("|")} ${gray.dim(server)}${dimPath ? gray.dim(path) : lime(path)}`
}

function getMaxHttpMethodNameLength(routeInfo) {
  return Math.max(
    ...routeInfo.map(({ method }) => Math.max(method.length, post.length)),
  )
}

export default function logRoutes(routeInfo) {
  const boxenOptions = {
    borderColor: "yellow",
    dimBorder: true,
    margin: 1,
    padding: 1,
  }
  const maxLength = getMaxHttpMethodNameLength(routeInfo)

  // eslint-disable-next-line no-console
  console.log(
    boxen(
      routeInfo
        .map(
          ({ invokePath, method, path, server }) =>
            // eslint-disable-next-line prefer-template
            logRoute(method, server, path, maxLength) +
            "\n" +
            logRoute(post, server, invokePath, maxLength, true),
        )
        .join("\n"),
      boxenOptions,
    ),
  )
}
