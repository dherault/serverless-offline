'use strict'

const InProcessRunner = require('./InProcessRunner.js')

// TODO handle this:
process.on('uncaughtException', (err) => {
  const {
    constructor: { name },
    message,
    stack,
  } = err

  process.send({
    // process.send() can't serialize an Error object, so we help it out a bit
    error: {
      constructor: {
        name,
      },
      message,
      stack,
    },
  })
})

const [, , functionName, handlerName, handlerPath] = process.argv

process.on('message', async (messageData) => {
  const { context, event, timeout } = messageData

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
    // TODO logging
    console.log(err)
    throw err
  }

  // TODO check serializeability (contains function, symbol etc)
  process.send(result)
})
