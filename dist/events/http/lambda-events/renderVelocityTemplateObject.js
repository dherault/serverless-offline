import { log } from '@serverless/utils/log.js'
import velocityjs from 'velocityjs'
import runInPollutedScope from '../javaHelpers.js'
import { isPlainObject } from '../../../utils/index.js'
const { parse } = JSON
const { entries } = Object
function tryToParseJSON(string) {
  let parsed
  try {
    parsed = parse(string)
  } catch {}
  return parsed || string
}
function renderVelocityString(velocityString, context) {
  const renderResult = runInPollutedScope(() =>
    new velocityjs.Compile(velocityjs.parse(velocityString), {
      escape: false,
    }).render(context, null, true),
  )
  log.debug('Velocity rendered:', renderResult || 'undefined')
  switch (renderResult) {
    case 'undefined':
      return undefined
    case 'null':
      return null
    case 'true':
      return true
    case 'false':
      return false
    default:
      return tryToParseJSON(renderResult)
  }
}
export default function renderVelocityTemplateObject(templateObject, context) {
  const result = {}
  let toProcess = templateObject
  if (typeof toProcess === 'string') {
    toProcess = tryToParseJSON(toProcess)
  }
  if (isPlainObject(toProcess)) {
    entries(toProcess).forEach(([key, value]) => {
      log.debug('Processing key:', key, '- value:', value)
      if (typeof value === 'string') {
        result[key] = renderVelocityString(value, context)
      } else if (isPlainObject(value)) {
        result[key] = renderVelocityTemplateObject(value, context)
      } else {
        result[key] = value
      }
    })
  } else if (typeof toProcess === 'string') {
    const alternativeResult = tryToParseJSON(
      renderVelocityString(toProcess, context),
    )
    return isPlainObject(alternativeResult) ? alternativeResult : result
  }
  return result
}
