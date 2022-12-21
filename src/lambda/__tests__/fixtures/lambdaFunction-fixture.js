'use strict'

exports.contextDoneHandler = function contextDoneHandler(event, context) {
  context.done(null, 'foo')
}

exports.contextDoneHandlerDeferred = function contextDoneHandlerDeferred(
  event,
  context,
) {
  setTimeout(() => context.done(null, 'foo'), 100)
}

exports.contextSucceedHandler = function contextSucceedHandler(event, context) {
  context.succeed('foo')
}

exports.contextSucceedHandlerDeferred = function contextSucceedHandlerDeferred(
  event,
  context,
) {
  setTimeout(() => context.succeed('foo'), 100)
}

exports.callbackHandler = function callbackHandler(event, context, callback) {
  callback(null, 'foo')
}

exports.callbackHandlerDeferred = function callbackHandlerDeferred(
  event,
  context,
  callback,
) {
  setTimeout(() => callback(null, 'foo'), 100)
}

exports.promiseHandler = function promiseHandler() {
  return Promise.resolve('foo')
}

exports.promiseHandlerDeferred = function promiseDeferred() {
  return new Promise((resolve) => {
    setTimeout(() => resolve('foo'), 100)
  })
}

exports.asyncFunctionHandler = async function asyncFunctionHandler() {
  return 'foo'
}

exports.asyncFunctionHandlerObject = async function asyncFunctionHandler() {
  return {
    foo: 'bar',
  }
}

// we deliberately test the case where a 'callback' is defined
// in the handler, but a promise is being returned to protect from a
// potential naive implementation, e.g.
//
// const { promisify } = 'utils'
// const promisifiedHandler = handler.length === 3 ? promisify(handler) : handler
//
// if someone would return a promise, but also defines callback, without using it
// the handler would not be returning anything
exports.promiseWithDefinedCallbackHandler =
  function promiseWithDefinedCallbackHandler(
    event, // eslint-disable-line no-unused-vars
    context, // eslint-disable-line no-unused-vars
    callback, // eslint-disable-line no-unused-vars
  ) {
    return Promise.resolve('Hello Promise!')
  }

exports.contextSucceedWithContextDoneHandler =
  function contextSucceedWithContextDoneHandler(event, context) {
    context.succeed('Hello Context.succeed!')

    context.done(null, 'Hello Context.done!')
  }

exports.callbackWithContextDoneHandler =
  function callbackWithContextDoneHandler(event, context, callback) {
    callback(null, 'Hello Callback!')

    context.done(null, 'Hello Context.done!')
  }

exports.callbackWithPromiseHandler = function callbackWithPromiseHandler(
  event,
  context,
  callback,
) {
  callback(null, 'Hello Callback!')

  return Promise.resolve('Hello Promise!')
}

exports.callbackInsidePromiseHandler = function callbackInsidePromiseHandler(
  event,
  context,
  callback,
) {
  return new Promise((resolve) => {
    callback(null, 'Hello Callback!')

    resolve('Hello Promise!')
  })
}

exports.requestIdHandler = async function requestIdHandler(event, context) {
  return context.awsRequestId
}

exports.remainingExecutionTimeHandler =
  async function remainingExecutionTimeHandler(event, context) {
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
  }

exports.defaultTimeoutHandler = async function defaultTimeoutHandler(
  event,
  context,
) {
  return context.getRemainingTimeInMillis()
}

exports.executionTimeInMillisHandler = function executionTimeInMillisHandler() {
  return new Promise((resolve) => {
    setTimeout(resolve, 100)
  })
}
