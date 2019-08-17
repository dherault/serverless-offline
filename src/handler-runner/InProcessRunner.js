'use strict'

const serverlessLog = require('../serverlessLog.js')

module.exports = class InProcessRunner {
  constructor(functionName, handlerPath, handlerName) {
    this._functionName = functionName
    this._handlerName = handlerName
    this._handlerPath = handlerPath
  }

  run(event, context, callback) {
    // TODO error handling? when module and/or function is not found
    // lazy load handler with first usage

    let handler

    try {
      handler = require(this._handlerPath)[this._handlerName] // eslint-disable-line
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        serverlessLog.errorLog(
          `Could not find handler module '${this._handlerPath}' for function '${this._functionName}'.`,
        )
      }

      throw err
    }

    if (typeof handler !== 'function') {
      throw new Error(
        `offline: handler '${this._handlerName}' in ${this._handlerPath} is not a function`,
      )
    }

    return handler(event, context, callback)
  }
}
