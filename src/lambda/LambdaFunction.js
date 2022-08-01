import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { performance } from 'node:perf_hooks'
import { log } from '@serverless/utils/log.js'
import { emptyDir, ensureDir, remove } from 'fs-extra'
import jszip from 'jszip'
import HandlerRunner from './handler-runner/index.js'
import LambdaContext from './LambdaContext.js'
import {
  DEFAULT_LAMBDA_MEMORY_SIZE,
  DEFAULT_LAMBDA_RUNTIME,
  DEFAULT_LAMBDA_TIMEOUT,
  supportedRuntimes,
} from '../config/index.js'
import { createUniqueId, splitHandlerPathAndName } from '../utils/index.js'

const { ceil } = Math
const { entries, fromEntries } = Object

export default class LambdaFunction {
  #artifact = null

  #clientContext = null

  #codeDir = null

  #event = null

  #executionTimeEnded = null

  #executionTimeStarted = null

  #functionKey = null

  #functionName = null

  #handler = null

  #handlerRunner = null

  #idleTimeStarted = null

  #initialized = false

  #lambdaContext = null

  #lambdaDir = null

  #memorySize = null

  #region = null

  #runtime = null

  #timeout = null

  status = 'IDLE' // can be 'BUSY' or 'IDLE'

  constructor(functionKey, functionDefinition, serverless, options) {
    const {
      service,
      config: { serverlessPath, servicePath },
      service: { provider, package: servicePackage = {} },
    } = serverless

    // TEMP options.location, for compatibility with serverless-webpack:
    // https://github.com/dherault/serverless-offline/issues/787
    // TODO FIXME look into better way to work with serverless-webpack
    const servicepath = resolve(servicePath, options.location || '')

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
    this.#handler = handler
    this.#memorySize = memorySize
    this.#region = provider.region
    this.#runtime = runtime
    this.#timeout = timeout

    this.#verifySupportedRuntime()

    const env = {
      ...(options.localEnvironment
        ? process.env
        : // we always copy all AWS_xxxx environment variables over from local env
          fromEntries(
            entries(process.env).filter(([key]) => key.startsWith('AWS_')),
          )),
      ...this.#getAwsEnvVars(),
      ...provider.environment,
      ...functionDefinition.environment,
      IS_OFFLINE: 'true',
    }

    this.#artifact = functionDefinition.package?.artifact

    if (!this.#artifact) {
      this.#artifact = service.package?.artifact
    }

    if (this.#artifact) {
      // lambda directory contains code and layers
      this.#lambdaDir = join(
        servicepath,
        '.serverless-offline',
        'services',
        service.service,
        functionKey,
        createUniqueId(),
      )
    }

    this.#codeDir = this.#lambdaDir
      ? resolve(this.#lambdaDir, 'code')
      : servicepath

    // TEMP
    const funOptions = {
      codeDir: this.#codeDir,
      functionKey,
      functionName: name,
      functionPackage: functionPackage.artifact
        ? resolve(servicepath, functionPackage.artifact)
        : undefined,
      handler,
      handlerName,
      handlerPath: resolve(this.#codeDir, handlerPath),
      layers: functionDefinition.layers || [],
      provider,
      runtime,
      serverlessPath,
      servicePackage: servicePackage.artifact
        ? resolve(servicepath, servicePackage.artifact)
        : undefined,
      servicePath: servicepath,
      timeout,
    }

    this.#handlerRunner = new HandlerRunner(funOptions, options, env)
    this.#lambdaContext = new LambdaContext(name, memorySize)
  }

  #startExecutionTimer() {
    this.#executionTimeStarted = performance.now()
    // this._executionTimeout = this.#executionTimeStarted + this.#timeout * 1000
  }

  #stopExecutionTimer() {
    this.#executionTimeEnded = performance.now()
  }

  #startIdleTimer() {
    this.#idleTimeStarted = performance.now()
  }

  #verifySupportedRuntime() {
    // print message but keep working (don't error out or exit process)
    if (!supportedRuntimes.has(this.#runtime)) {
      log.warning()
      log.warning(
        `Warning: found unsupported runtime '${this.#runtime}' for function '${
          this.#functionKey
        }'`,
      )
    }
  }

  // based on:
  // https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/index.js#L108
  #getAwsEnvVars() {
    return {
      _HANDLER: this.#handler,
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
        '/usr/local/lib64/node-v4.3.x/lib:/lib64:/usr/lib64:/var/runtime:/var/runtime/lib:/var/task:/var/task/lib:/opt/lib',
      NODE_PATH: '/var/runtime:/var/task:/var/runtime/node_modules',
    }
  }

  setClientContext(clientContext) {
    this.#clientContext = clientContext
  }

  setEvent(event) {
    this.#event = event
  }

  // () => Promise<void>
  async cleanup() {
    // TODO console.log('lambda cleanup')
    await this.#handlerRunner.cleanup()
    if (this.#lambdaDir) {
      await remove(this.#lambdaDir)
    }
  }

  #executionTimeInMillis() {
    return this.#executionTimeEnded - this.#executionTimeStarted
  }

  // round up to the nearest ms
  #billedExecutionTimeInMillis() {
    return ceil(this.#executionTimeEnded - this.#executionTimeStarted)
  }

  // extractArtifact, loosely based on:
  // https://github.com/serverless/serverless/blob/v1.57.0/lib/plugins/aws/invokeLocal/index.js#L312
  async #extractArtifact() {
    if (!this.#artifact) {
      return
    }

    await emptyDir(this.#codeDir)

    const data = await readFile(this.#artifact)
    const zip = await jszip.loadAsync(data)

    await Promise.all(
      entries(zip.files).map(async ([filename, jsZipObj]) => {
        const fileData = await jsZipObj.async('nodebuffer')
        if (filename.endsWith('/')) {
          return Promise.resolve()
        }
        await ensureDir(join(this.#codeDir, dirname(filename)))
        return writeFile(join(this.#codeDir, filename), fileData, {
          mode: jsZipObj.unixPermissions,
        })
      }),
    )
  }

  async #initialize() {
    await this.#extractArtifact()
    this.#initialized = true
  }

  get idleTimeInMinutes() {
    return (performance.now() - this.#idleTimeStarted) / 1000 / 60
  }

  get functionName() {
    return this.#functionName
  }

  async runHandler() {
    this.status = 'BUSY'

    if (!this.#initialized) {
      await this.#initialize()
    }

    const requestId = createUniqueId()

    this.#lambdaContext.setRequestId(requestId)
    this.#lambdaContext.setClientContext(this.#clientContext)

    const context = this.#lambdaContext.create()

    this.#startExecutionTimer()

    const result = await this.#handlerRunner.run(this.#event, context)

    this.#stopExecutionTimer()

    // TEMP TODO FIXME find better solution
    if (!this.#handlerRunner.isDockerRunner()) {
      log.notice(
        `(λ: ${
          this.#functionKey
        }) RequestId: ${requestId}  Duration: ${this.#executionTimeInMillis().toFixed(
          2,
        )} ms  Billed Duration: ${this.#billedExecutionTimeInMillis()} ms`,
      )
    }

    this.status = 'IDLE'
    this.#startIdleTimer()

    return result
  }
}
