'use strict'

const { resolve } = require('path')
const HandlerRunner = require('./handler-runner/index.js')
const LambdaContext = require('./LambdaContext.js')
const serverlessLog = require('./serverlessLog.js')
const {
  DEFAULT_LAMBDA_MEMORY_SIZE,
  DEFAULT_LAMBDA_RUNTIME,
  DEFAULT_LAMBDA_TIMEOUT,
  supportedRuntimes,
} = require('./config/index.js')
const { createUniqueId, splitHandlerPathAndName } = require('./utils/index.js')

const { now } = Date

module.exports = class LambdaFunction {
  constructor(functionName, functionObj, provider, config, options) {
    // TEMP options.location, for compatibility with serverless-webpack:
    // https://github.com/dherault/serverless-offline/issues/787
    // TODO FIXME look into better way to work with serverless-webpack
    const servicePath = resolve(config.servicePath, options.location || '')
    const { /* servicePath, */ serverlessPath } = config

    const { name, handler } = functionObj
    const [handlerPath, handlerName] = splitHandlerPathAndName(handler)

    const memorySize =
      functionObj.memorySize ||
      provider.memorySize ||
      DEFAULT_LAMBDA_MEMORY_SIZE

    const runtime =
      functionObj.runtime || provider.runtime || DEFAULT_LAMBDA_RUNTIME

    const timeout =
      (functionObj.timeout || provider.timeout || DEFAULT_LAMBDA_TIMEOUT) * 1000

    // TEMP
    const funOptions = {
      functionName,
      handlerName,
      handlerPath: resolve(servicePath, handlerPath),
      runtime,
      serverlessPath,
      servicePath,
    }

    this._awsRequestId = null
    this._environment = {
      ...provider.environment,
      ...functionObj.environment,
    }
    this._executionTimeEnded = null
    this._executionTimeStarted = null
    this._executionTimeout = null
    this._functionName = functionName
    this._handler = handler
    this._handlerRunner = new HandlerRunner(funOptions, options, this._stage)
    this._lambdaName = name
    this._memorySize = memorySize
    this._region = provider.region
    this._runtime = runtime
    this._serverlessPath = serverlessPath
    this._servicePath = servicePath
    this._stage = provider.stage
    this._timeout = timeout

    this._verifySupportedRuntime()
  }

  _startExecutionTimer() {
    this._executionTimeStarted = now()
    this._executionTimeout = this._executionTimeStarted + this._timeout * 1000
  }

  _stopExecutionTimer() {
    this._executionTimeEnded = now()
  }

  _verifySupportedRuntime() {
    // print message but keep working (don't error out or exit process)
    if (!supportedRuntimes.has(this._runtime)) {
      // this.printBlankLine(); // TODO
      console.log('')
      serverlessLog(
        `Warning: found unsupported runtime '${this._runtime}' for function '${this._functionName}'`,
      )
    }
  }

  // based on:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/index.js#L108
  _getAwsEnvVars() {
    return {
      AWS_DEFAULT_REGION: this._region,
      AWS_LAMBDA_FUNCTION_MEMORY_SIZE: this._memorySize,
      AWS_LAMBDA_FUNCTION_NAME: this._lambdaName,
      AWS_LAMBDA_FUNCTION_VERSION: '$LATEST',
      // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/lib/naming.js#L123
      AWS_LAMBDA_LOG_GROUP_NAME: `/aws/lambda/${this._lambdaName}`,
      AWS_LAMBDA_LOG_STREAM_NAME:
        '2016/12/02/[$LATEST]f77ff5e4026c45bda9a9ebcec6bc9cad',
      AWS_REGION: this._region,
      LANG: 'en_US.UTF-8',
      LAMBDA_RUNTIME_DIR: '/var/runtime',
      LAMBDA_TASK_ROOT: '/var/task',
      LD_LIBRARY_PATH:
        '/usr/local/lib64/node-v4.3.x/lib:/lib64:/usr/lib64:/var/runtime:/var/runtime/lib:/var/task:/var/task/lib',
      NODE_PATH: '/var/runtime:/var/task:/var/runtime/node_modules',
    }
  }

  _getProcessEnv() {
    return {
      ...process.env,
      ...this._getAwsEnvVars(),
      ...this._environment,
      _HANDLER: this._handler, // TODO is this available in AWS?
    }
  }

  addEvent(event) {
    this._event = event
  }

  getExecutionTimeInMillis() {
    return this._executionTimeEnded - this._executionTimeStarted
  }

  getAwsRequestId() {
    return this._awsRequestId
  }

  async runHandler() {
    this._awsRequestId = createUniqueId()

    const lambdaContext = new LambdaContext({
      awsRequestId: this._awsRequestId,
      getRemainingTimeInMillis: () => {
        const time = this._executionTimeout - now()

        // just return 0 for now if we are beyond alotted time (timeout)
        return time > 0 ? time : 0
      },
      lambdaName: this._lambdaName,
      memorySize: this._memorySize,
    })

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

    const context = lambdaContext.create()

    this._startExecutionTimer()

    let result

    process.env = this._getProcessEnv()

    // execute (run) handler
    try {
      result = this._handlerRunner.run(this._event, context, callback)
    } catch (err) {
      // this only executes when we have an exception caused by synchronous code
      // TODO logging
      console.log(err)
      throw new Error(`Uncaught error in '${this._functionName}' handler.`)
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

    this._stopExecutionTimer()

    return callbackResult
  }
}
