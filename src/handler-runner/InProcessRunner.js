'use strict'

module.exports = class InProcessRunner {
  constructor(handlerPath, handlerName) {
    this._handler = require(handlerPath)[handlerName] // eslint-disable-line

    if (typeof this._handler !== 'function') {
      throw new Error(
        `Serverless-offline: handler '${handlerName}' in ${handlerPath} is not a function`,
      )
    }
  }

  run(event, context, callback) {
    return this._handler(event, context, callback)
  }
}
