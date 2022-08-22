'use strict'

const { stringify } = JSON

exports.contextDoneHandler = function contextDoneHandler(event, context) {
  context.done(null, {
    body: stringify('foo'),
    statusCode: 200,
  })
}

exports.contextDoneHandlerDeferred = function contextDoneHandlerDeferred(
  event,
  context,
) {
  setTimeout(
    () =>
      context.done(null, {
        body: stringify('foo'),
        statusCode: 200,
      }),
    100,
  )
}

exports.contextSucceedHandler = function contextSucceedHandler(event, context) {
  context.succeed({
    body: stringify('foo'),
    statusCode: 200,
  })
}

exports.contextSucceedHandlerDeferred = function contextSucceedHandlerDeferred(
  event,
  context,
) {
  setTimeout(
    () =>
      context.succeed({
        body: stringify('foo'),
        statusCode: 200,
      }),
    100,
  )
}

exports.callbackHandler = function callbackHandler(event, context, callback) {
  callback(null, {
    body: stringify('foo'),
    statusCode: 200,
  })
}

exports.callbackHandlerDeferred = function callbackHandlerDeferred(
  event,
  context,
  callback,
) {
  setTimeout(
    () =>
      callback(null, {
        body: stringify('foo'),
        statusCode: 200,
      }),
    100,
  )
}

exports.promiseHandler = function promiseHandler() {
  return Promise.resolve({
    body: stringify('foo'),
    statusCode: 200,
  })
}

exports.promiseHandlerDeferred = function promiseDeferred() {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          body: stringify('foo'),
          statusCode: 200,
        }),
      100,
    )
  })
}

exports.asyncFunctionHandler = async function asyncFunctionHandler() {
  return {
    body: stringify('foo'),
    statusCode: 200,
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
    return Promise.resolve({
      body: stringify('Hello Promise!'),
      statusCode: 200,
    })
  }

exports.contextSucceedWithContextDoneHandler =
  function contextSucceedWithContextDoneHandler(event, context) {
    context.succeed({
      body: stringify('Hello Context.succeed!'),
      statusCode: 200,
    })

    context.done(null, {
      body: stringify('Hello Context.done!'),
      statusCode: 200,
    })
  }

exports.callbackWithContextDoneHandler =
  function callbackWithContextDoneHandler(event, context, callback) {
    callback(null, {
      body: stringify('Hello Callback!'),
      statusCode: 200,
    })

    context.done(null, {
      body: stringify('Hello Context.done!'),
      statusCode: 200,
    })
  }

exports.callbackWithPromiseHandler = function callbackWithPromiseHandler(
  event,
  context,
  callback,
) {
  callback(null, {
    body: stringify('Hello Callback!'),
    statusCode: 200,
  })

  return Promise.resolve({
    body: stringify('Hello Promise!'),
    statusCode: 200,
  })
}

exports.callbackInsidePromiseHandler = function callbackInsidePromiseHandler(
  event,
  context,
  callback,
) {
  return new Promise((resolve) => {
    callback(null, {
      body: stringify('Hello Callback!'),
      statusCode: 200,
    })

    resolve({
      body: stringify('Hello Promise!'),
      statusCode: 200,
    })
  })
}

exports.throwExceptionInPromiseHandler = async () => {
  throw NaN
}

exports.throwExceptionInCallbackHandler = () => {
  throw NaN
}

exports.NoAnswerInPromiseHandler = async () => {}

exports.BadAnswerInPromiseHandler = async () => {
  return {}
}

exports.BadAnswerInCallbackHandler = (event, context, callback) => {
  callback(null, {})
}

exports.TestPathVariable = (event, context, callback) => {
  callback(null, {
    body: stringify(event.path),
    statusCode: 200,
  })
}

exports.TestResourceVariable = (event, context, callback) => {
  callback(null, {
    body: stringify(event.resource),
    statusCode: 200,
  })
}
