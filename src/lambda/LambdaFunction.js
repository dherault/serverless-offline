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
  #clientContext = null
  #event = null
  #executionTimeEnded = null
  #executionTimeStarted = null
  #functionKey = null
  #functionName = null
  #handlerRunner = null
  #idleTimeStarted = null
  #lambdaContext = null
  #memorySize = null
  #region = null
  #runtime = null
  #timeout = null

  status = 'IDLE' // can be 'BUSY' or 'IDLE'

  constructor(functionKey, functionDefinition, serverless, options) {
    const {
      config: { serverlessPath, servicePath },
      service: { provider, package: servicePackage = {} },
    } = serverless

    // TEMP options.location, for compatibility with serverless-webpack:
    // https://github.com/dherault/serverless-offline/issues/787
    // TODO FIXME look into better way to work with serverless-webpack
    const _servicePath = resolve(servicePath, options.location || '')

    const { handler, name, package: functionPackage = {} } = functionDefinition
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

    // this._executionTimeout = null
    this.#functionKey = functionKey
    this.#functionName = name
    this.#memorySize = memorySize
    this.#region = provider.region
    this.#runtime = runtime
    this.#timeout = timeout

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
      functionName: name,
      servicePackage: servicePackage.artifact
        ? resolve(_servicePath, servicePackage.artifact)
        : undefined,
      functionPackage: functionPackage.artifact
        ? resolve(_servicePath, functionPackage.artifact)
        : undefined,
    }

    this.#handlerRunner = new HandlerRunner(funOptions, options, env)
    this.#lambdaContext = new LambdaContext(name, memorySize)
  }

  _startExecutionTimer() {
    this.#executionTimeStarted = performance.now()
    // this._executionTimeout = this.#executionTimeStarted + this.#timeout * 1000
  }

  _stopExecutionTimer() {
    this.#executionTimeEnded = performance.now()
  }

  _startIdleTimer() {
    this.#idleTimeStarted = performance.now()
  }

  _verifySupportedRuntime() {
    // print message but keep working (don't error out or exit process)
    if (!supportedRuntimes.has(this.#runtime)) {
      // this.printBlankLine(); // TODO
      console.log('')
      serverlessLog(
        `Warning: found unsupported runtime '${this.#runtime}' for function '${
          this.#functionKey
        }'`,
      )
    }
  }

  // based on:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/index.js#L108
  _getAwsEnvVars() {
    return {
      AWS_DEFAULT_REGION: this.#region,
      AWS_LAMBDA_FUNCTION_MEMORY_SIZE: this.#memorySize,
      AWS_LAMBDA_FUNCTION_NAME: this.#functionName,
      AWS_LAMBDA_FUNCTION_VERSION: '$LATEST',
      // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/lib/naming.js#L123
      AWS_LAMBDA_LOG_GROUP_NAME: `/aws/lambda/${this.#functionName}`,
      AWS_LAMBDA_LOG_STREAM_NAME:
        '2016/12/02/[$LATEST]f77ff5e4026c45bda9a9ebcec6bc9cad',
      AWS_REGION: this.#region,
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
    this.#clientContext = clientContext
  }

  setEvent(event) {
    this.#event = event
  }

  // () => Promise<void>
  cleanup() {
    // TODO console.log('lambda cleanup')
    return this.#handlerRunner.cleanup()
  }

  _executionTimeInMillis() {
    return this.#executionTimeEnded - this.#executionTimeStarted
  }

  // rounds up to the nearest 100 ms
  _billedExecutionTimeInMillis() {
    return (
      ceil((this.#executionTimeEnded - this.#executionTimeStarted) / 100) * 100
    )
  }

  get idleTimeInMinutes() {
    return (performance.now() - this.#idleTimeStarted) / 1000 / 60
  }

  get functionName() {
    return this.#functionName
  }

  async runHandler() {
    this.status = 'BUSY'

    const requestId = createUniqueId()

    this.#lambdaContext.setRequestId(requestId)
    this.#lambdaContext.setClientContext(this.#clientContext)

    const context = this.#lambdaContext.create()

    this._startExecutionTimer()

    const result = await this.#handlerRunner.run(this.#event, context)

    this._stopExecutionTimer()

    // TEMP TODO FIXME find better solution
    if (!this.#handlerRunner.isDockerRunner()) {
      serverlessLog(
        `(λ: ${
          this.#functionKey
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
