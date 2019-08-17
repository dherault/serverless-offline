'use strict'

module.exports = class InProcessRunner {
  constructor(functionName, handlerPath, handlerName) {
    this._functionName = functionName
    this._handlerName = handlerName
    this._handlerPath = handlerPath
  }

  run(event, context, callback) {
    // check if the handler module path exists
    if (!require.resolve(this._handlerPath)) {
      throw new Error(
        `Could not find handler module '${this._handlerPath}' for function '${this._functionName}'.`,
      )
    }

    // lazy load handler with first usage
    const handler = require(this._handlerPath)[this._handlerName] // eslint-disable-line

    if (typeof handler !== 'function') {
      throw new Error(
        `offline: handler '${this._handlerName}' in ${this._handlerPath} is not a function`,
      )
    }

    return handler(event, context, callback)
  }
}
