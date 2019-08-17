'use strict'

const { parentPort, workerData } = require('worker_threads') // eslint-disable-line import/no-unresolved
const InProcessRunner = require('./InProcessRunner.js')
const LambdaContext = require('../LambdaContext.js')

const { functionName, handlerName, handlerPath } = workerData

parentPort.on('message', async (messageData) => {
  const { context, event, port } = messageData

  // TODO
  context.getRemainingTimeInMillis = () => {}

  const lambdaContext = new LambdaContext(context)

  let callback

  const callbackCalled = new Promise((resolve, reject) => {
    callback = (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    }

    lambdaContext.once('contextCalled', callback)
  })

  const newContext = lambdaContext.create()
  const inProcessRunner = new InProcessRunner(
    functionName,
    handlerPath,
    handlerName,
  )

  let result

  // TODO
  // // supply a clean env
  // process.env = {
  //   ...this._env,
  // }

  // execute (run) handler
  try {
    result = inProcessRunner.run(event, newContext, callback)
  } catch (err) {
    // this only executes when we have an exception caused by synchronous code
    // TODO logging
    console.log(err)
    throw err
  }

  // // not a Promise, which is not supported by aws
  // if (result == null || typeof result.then !== 'function') {
  //   throw new Error(`Synchronous function execution is not supported.`);
  // }

  const callbacks = [callbackCalled]

  // Promise was returned
  if (result != null && typeof result.then === 'function') {
    callbacks.push(result)
  }

  let callbackResult

  try {
    callbackResult = await Promise.race(callbacks)
  } catch (err) {
    // TODO logging
    console.log(err)
    throw err
  }

  // TODO check serializeability (contains function, symbol etc)
  port.postMessage(callbackResult)
})
