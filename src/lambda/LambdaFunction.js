import { resolve } from 'path'
import { performance } from 'perf_hooks'
import HandlerRunner from './handler-runner/index.js'
import LambdaContext from './LambdaContext.js'
import serverlessLog from '../serverlessLog.js'
import {
  DEFAULT_LAMBDA_MEMORY_SIZE,
  DEFAULT_LAMBDA_RUNTIME,
  DEFAULT_LAMBDA_TIMEOUT,
  supportedRuntimes,
} from '../config/index.js'
import { createUniqueId, splitHandlerPathAndName } from '../utils/index.js'

const { ceil } = Math

export default class LambdaFunction {
  constructor(functionKey, functionDefinition, serverless, options) {
    this.status = 'IDLE' // can be 'BUSY' or 'IDLE'

    const {
      config: { serverlessPath, servicePath },
      service: { provider },
    } = serverless

    // TEMP options.location, for compatibility with serverless-webpack:
    // https://github.com/dherault/serverless-offline/issues/787
    // TODO FIXME look into better way to work with serverless-webpack
    const _servicePath = resolve(servicePath, options.location || '')

    const { handler, name } = functionDefinition
    const [handlerPath, handlerName] = splitHandlerPathAndName(handler)

    const memorySize =
      functionDefinition.memorySize ||
      provider.memorySize ||
      DEFAULT_LAMBDA_MEMORY_SIZE

    const runtime =
      functionDefinition.runtime || provider.runtime || DEFAULT_LAMBDA_RUNTIME

    const timeout =
      (functionDefinition.timeout ||
        provider.timeout ||
        DEFAULT_LAMBDA_TIMEOUT) * 1000

    this._executionTimeEnded = null
    this._executionTimeStarted = null
    // this._executionTimeout = null
    this._functionKey = functionKey
    this._idleTimeStarted = null
    this._functionName = name
    this._memorySize = memorySize
    this._region = provider.region
    this._runtime = runtime
    this._timeout = timeout

    this._verifySupportedRuntime()

    const env = this._getEnv(
      provider.environment,
      functionDefinition.environment,
      handler,
    )

    let artifact = functionDefinition.package
      ? functionDefinition.package.artifact
      : null
    if (!artifact) {
      artifact = serverless.service.package
        ? serverless.service.package.artifact
        : null
    }

    // TEMP
    const funOptions = {
      functionKey,
      handler,
      handlerName,
      handlerPath: resolve(_servicePath, handlerPath),
      runtime,
      serverlessPath,
      servicePath: _servicePath,
      artifact,
      timeout,
    }

    this._lambdaContext = new LambdaContext(name, memorySize)
    this._handlerRunner = new HandlerRunner(funOptions, options, env)
  }

  _startExecutionTimer() {
    this._executionTimeStarted = performance.now()
    // this._executionTimeout = this._executionTimeStarted + this._timeout * 1000
  }

  _stopExecutionTimer() {
    this._executionTimeEnded = performance.now()
  }

  _startIdleTimer() {
    this._idleTimeStarted = performance.now()
  }

  _verifySupportedRuntime() {
    // print message but keep working (don't error out or exit process)
    if (!supportedRuntimes.has(this._runtime)) {
      // this.printBlankLine(); // TODO
      console.log('')
      serverlessLog(
        `Warning: found unsupported runtime '${this._runtime}' for function '${this._functionKey}'`,
      )
    }
  }

  // based on:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/index.js#L108
  _getAwsEnvVars() {
    return {
      AWS_DEFAULT_REGION: this._region,
      AWS_LAMBDA_FUNCTION_MEMORY_SIZE: this._memorySize,
      AWS_LAMBDA_FUNCTION_NAME: this._functionName,
      AWS_LAMBDA_FUNCTION_VERSION: '$LATEST',
      // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/lib/naming.js#L123
      AWS_LAMBDA_LOG_GROUP_NAME: `/aws/lambda/${this._functionName}`,
      AWS_LAMBDA_LOG_STREAM_NAME:
        '2016/12/02/[$LATEST]f77ff5e4026c45bda9a9ebcec6bc9cad',
      AWS_REGION: this._region,
      LAMBDA_RUNTIME_DIR: '/var/runtime',
      LAMBDA_TASK_ROOT: '/var/task',
      LANG: 'en_US.UTF-8',
      LD_LIBRARY_PATH:
        '/usr/local/lib64/node-v4.3.x/lib:/lib64:/usr/lib64:/var/runtime:/var/runtime/lib:/var/task:/var/task/lib',
      NODE_PATH: '/var/runtime:/var/task:/var/runtime/node_modules',
    }
  }

  _getEnv(providerEnv, functionDefinitionEnv, handler) {
    return {
      ...this._getAwsEnvVars(),
      ...providerEnv,
      ...functionDefinitionEnv,
      _HANDLER: handler, // TODO is this available in AWS?
    }
  }

  setClientContext(clientContext) {
    this._clientContext = clientContext
  }

  setEvent(event) {
    this._event = event
  }

  // () => Promise<void>
  cleanup() {
    // TODO console.log('lambda cleanup')
    return this._handlerRunner.cleanup()
  }

  _executionTimeInMillis() {
    return this._executionTimeEnded - this._executionTimeStarted
  }

  // rounds up to the nearest 100 ms
  _billedExecutionTimeInMillis() {
    return (
      ceil((this._executionTimeEnded - this._executionTimeStarted) / 100) * 100
    )
  }

  get idleTimeInMinutes() {
    return (performance.now() - this._idleTimeStarted) / 1000 / 60
  }

  get functionName() {
    return this._functionName
  }

  async runHandler() {
    this.status = 'BUSY'

    const requestId = createUniqueId()

    this._lambdaContext.setRequestId(requestId)
    this._lambdaContext.setClientContext(this._clientContext)

    const context = this._lambdaContext.create()

    this._startExecutionTimer()

    const result = await this._handlerRunner.run(this._event, context)

    this._stopExecutionTimer()

    // TEMP TODO FIXME find better solution
    if (!this._handlerRunner.isDockerRunner()) {
      serverlessLog(
        `(λ: ${
          this._functionKey
        }) RequestId: ${requestId}  Duration: ${this._executionTimeInMillis().toFixed(
          2,
        )} ms  Billed Duration: ${this._billedExecutionTimeInMillis()} ms`,
      )
    }

    this.status = 'IDLE'
    this._startIdleTimer()

    return result
  }
}
