'use strict'

const { now } = Date

process.on('uncaughtException', (e) => {
  const { constructor, message, stack } = e

  process.send({
    // process.send() can't serialize an Error object, so we help it out a bit
    error: {
      constructor: {
        name: constructor.name,
      },
      ipcException: true,
      message,
      stack,
    },
  })
})

const [, , handlerPath] = process.argv

process.on('message', (messageData) => {
  const {
    context: messageContext,
    event,
    functionName,
    handlerName,
    id,
    memorySize,
    timeout,
  } = messageData

  function callback(error, data) {
    process.send({
      data,
      error,
      id,
    })
  }

  // eslint-disable-next-line
  const handlerModule = require(handlerPath)

  const handler = handlerModule[handlerName]

  if (typeof handler !== 'function') {
    throw new Error(
      `Serverless-offline: handler for '${handlerName}' is not a function`,
    )
  }

  const endTime = now() + (timeout ? timeout * 1000 : 6000)

  const context = {
    ...messageContext,

    done: callback,
    fail: (err) => callback(err, null),
    succeed: (res) => callback(null, res),

    getRemainingTimeInMillis() {
      return endTime - now()
    },

    awsRequestId: `offline_awsRequestId_${id}`,
    clientContext: {},
    functionName,
    functionVersion: `offline_functionVersion_for_${functionName}`,
    identity: {},
    invokedFunctionArn: `offline_invokedFunctionArn_for_${functionName}`,
    logGroupName: `offline_logGroupName_for_${functionName}`,
    logStreamName: `offline_logStreamName_for_${functionName}`,
    memoryLimitInMB: memorySize,
  }

  const result = handler(event, context, callback)

  if (result && typeof result.then === 'function') {
    result
      .then((data) => callback(null, data))
      .catch((err) => callback(err, null))
  } else if (result instanceof Error) {
    callback(result, null)
  }
})
