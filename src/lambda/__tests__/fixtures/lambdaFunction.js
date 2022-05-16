'use strict'

exports.fixture = {
  contextDoneHandler(event, context) {
    context.done(null, 'foo')
  },

  contextDoneHandlerDeferred(event, context) {
    setTimeout(() => context.done(null, 'foo'), 100)
  },

  contextSucceedHandler(event, context) {
    context.succeed('foo')
  },

  contextSucceedHandlerDeferred(event, context) {
    setTimeout(() => context.succeed('foo'), 100)
  },

  callbackHandler(event, context, callback) {
    callback(null, 'foo')
  },

  callbackHandlerDeferred(event, context, callback) {
    setTimeout(() => callback(null, 'foo'), 100)
  },

  promiseHandler() {
    return Promise.resolve('foo')
  },

  promiseHandlerDeferred() {
    return new Promise((resolve) => {
      setTimeout(() => resolve('foo'), 100)
    })
  },

  async asyncFunctionHandler() {
    return 'foo'
  },

  async asyncFunctionHandlerObject() {
    return {
      foo: 'bar',
    }
  },

  // we deliberately test the case where a 'callback' is defined
  // in the handler, but a promise is being returned to protect from a
  // potential naive implementation, e.g.
  //
  // const { promisify } = 'utils'
  // const promisifiedHandler = handler.length === 3 ? promisify(handler) : handler
  //
  // if someone would return a promise, but also defines callback, without using it
  // the handler would not be returning anything

  promiseWithDefinedCallbackHandler(
    event, // eslint-disable-line no-unused-vars
    context, // eslint-disable-line no-unused-vars
    callback, // eslint-disable-line no-unused-vars
  ) {
    return Promise.resolve('Hello Promise!')
  },

  contextSucceedWithContextDoneHandler(event, context) {
    context.succeed('Hello Context.succeed!')

    context.done(null, 'Hello Context.done!')
  },

  callbackWithContextDoneHandler(event, context, callback) {
    callback(null, 'Hello Callback!')

    context.done(null, 'Hello Context.done!')
  },

  callbackWithPromiseHandler(event, context, callback) {
    callback(null, 'Hello Callback!')

    return Promise.resolve('Hello Promise!')
  },

  callbackInsidePromiseHandler(event, context, callback) {
    return new Promise((resolve) => {
      callback(null, 'Hello Callback!')

      resolve('Hello Promise!')
    })
  },

  async requestIdHandler(event, context) {
    return context.awsRequestId
  },

  async remainingExecutionTimeHandler(event, context) {
    const first = context.getRemainingTimeInMillis()

    await new Promise((resolve) => {
      setTimeout(resolve, 100)
    })

    const second = context.getRemainingTimeInMillis()

    await new Promise((resolve) => {
      setTimeout(resolve, 200)
    })

    const third = context.getRemainingTimeInMillis()

    return [first, second, third]
  },

  async defaultTimeoutHandler(event, context) {
    return context.getRemainingTimeInMillis()
  },

  executionTimeInMillisHandler() {
    return new Promise((resolve) => {
      setTimeout(resolve, 100)
    })
  },
}
