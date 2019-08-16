'use strict'

module.exports = class InProcessRunner {
  constructor(handlerPath, handlerName) {
    this._handlerName = handlerName
    this._handlerPath = handlerPath
  }

  run(event, context, callback) {
    // TODO error handling? when module and/or function is not found
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
