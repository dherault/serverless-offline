'use strict'

const createHandler = require('./createHandler.js')

module.exports = class HandlerRunner {
  constructor(funOptions, options) {
    this._funOptions = funOptions
    this._options = options
  }

  run(event, context, callback) {
    const handler = createHandler(this._funOptions, this._options)

    return handler(event, context, callback)
  }
}
