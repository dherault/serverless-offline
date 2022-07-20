import process, { argv } from 'node:process'
import InProcessRunner from '../in-process-runner/index.js'

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

const [, , functionKey, handlerName, handlerPath] = argv

process.on('message', async (messageData) => {
  const { context, event, timeout } = messageData

  // TODO we could probably cache this in the module scope?
  const inProcessRunner = new InProcessRunner(
    functionKey,
    handlerPath,
    handlerName,
    process.env,
    timeout,
  )

  const result = await inProcessRunner.run(event, context)

  // TODO check serializeability (contains function, symbol etc)
  process.send(result)
})
