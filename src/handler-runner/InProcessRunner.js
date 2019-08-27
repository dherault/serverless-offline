'use strict'

const { assign } = Object

module.exports = class InProcessRunner {
  constructor(functionName, handlerPath, handlerName, env) {
    this._env = env
    this._functionName = functionName
    this._handlerName = handlerName
    this._handlerPath = handlerPath
  }

  // no-op
  // () => void
  cleanup() {}

  run(event, context, callback) {
    // check if the handler module path exists
    if (!require.resolve(this._handlerPath)) {
      throw new Error(
        `Could not find handler module '${this._handlerPath}' for function '${this._functionName}'.`,
      )
    }

    // process.env should be available in the handler module scope as well as in the handler function scope
    // NOTE: Don't use Object spread (...) here!
    // otherwise the values of the attached props are not coerced to a string
    // e.g. process.env.foo = 1 should be coerced to '1' (string)
    assign(process.env, this._env)

    // lazy load handler with first usage
    const handler = require(this._handlerPath)[this._handlerName] // eslint-disable-line

    if (typeof handler !== 'function') {
      throw new Error(
        `offline: handler '${this._handlerName}' in ${this._handlerPath} is not a function`,
      )
    }

    // NOTE: uncomment when we import() the handler module asynchronous
    // assign(process.env, this._env)

    return handler(event, context, callback)
  }
}
