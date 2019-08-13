'use strict'

const { join } = require('path')
const { splitHandlerPathAndName } = require('./utils/index.js')

// TODO remove
module.exports = function getFunctionOptions(
  functionName,
  functionObj,
  servicePath,
  serviceRuntime,
) {
  const { handler, memorySize, name, runtime, timeout } = functionObj
  const [handlerPath, handlerName] = splitHandlerPathAndName(handler)

  return {
    functionName,
    handlerName, // i.e. run
    handlerPath: join(servicePath, handlerPath),
    lambdaName: name,
    memorySize,
    runtime: runtime || serviceRuntime,
    timeout: (timeout || 30) * 1000,
  }
}
