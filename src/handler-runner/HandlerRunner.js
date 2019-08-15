'use strict'

const createHandler = require('./createHandler.js')

module.exports = class HandlerRunner {
  constructor(funOptions, options) {
    this._handler = createHandler(funOptions, options)
  }

  run(event, context, callback) {
    return this._handler(event, context, callback)
  }
}
