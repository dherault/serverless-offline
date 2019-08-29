'use strict'

const { parentPort, workerData } = require('worker_threads') // eslint-disable-line import/no-unresolved
const InProcessRunner = require('./InProcessRunner.js')

const { functionName, handlerName, handlerPath } = workerData

parentPort.on('message', async (messageData) => {
  const { context, event, port, timeout } = messageData

  // TODO we could probably cash this in the module scope?
  const inProcessRunner = new InProcessRunner(
    functionName,
    handlerPath,
    handlerName,
    process.env,
    timeout,
  )

  let result

  try {
    result = await inProcessRunner.run(event, context)
  } catch (err) {
    // this only executes when we have an exception caused by synchronous code
    // TODO logging
    console.log(err)
    throw err
  }

  // TODO check serializeability (contains function, symbol etc)
  port.postMessage(result)
})
