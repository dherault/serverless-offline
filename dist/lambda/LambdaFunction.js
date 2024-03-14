import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { performance } from 'node:perf_hooks'
import { log } from '@serverless/utils/log.js'
import { emptyDir, ensureDir, remove } from 'fs-extra'
import jszip from 'jszip'
import HandlerRunner from './handler-runner/index.js'
import LambdaContext from './LambdaContext.js'
import resolveJoins from '../utils/resolveJoins.js'
import {
  DEFAULT_LAMBDA_MEMORY_SIZE,
  DEFAULT_LAMBDA_RUNTIME,
  DEFAULT_LAMBDA_TIMEOUT,
  supportedRuntimes,
} from '../config/index.js'
import { createUniqueId, splitHandlerPathAndName } from '../utils/index.js'
const { entries } = Object
const { ceil } = Math
export default class LambdaFunction {
  #artifact = null
  #clientContext = null
  #codeDir = null
  #event = null
  #executionTimeEnded = null
  #executionTimeStarted = null
  #functionKey = null
  #functionName = null
  #handlerRunner = null
  #idleTimeStarted = null
  #initialized = false
  #lambdaContext = null
  #lambdaDir = null
  #memorySize = null
  #region = null
  #runtime = null
  #timeout = null
  status = 'IDLE'
  constructor(functionKey, functionDefinition, serverless, options) {
    const {
      service,
      config: { serverlessPath, servicePath },
      service: { provider, package: servicePackage = {} },
    } = serverless
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
    this.#functionKey = functionKey
    this.#functionName = name
    this.#memorySize = memorySize
    this.#region = provider.region
    this.#runtime = runtime
    this.#timeout = timeout
    this.#verifySupportedRuntime()
    const env = this.#getEnv(
      resolveJoins(provider.environment),
      functionDefinition.environment,
      handler,
    )
    this.#artifact = functionDefinition.package?.artifact
    if (!this.#artifact) {
      this.#artifact = service.package?.artifact
    }
    if (this.#artifact) {
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
  }
  #stopExecutionTimer() {
    this.#executionTimeEnded = performance.now()
  }
  #startIdleTimer() {
    this.#idleTimeStarted = performance.now()
  }
  #verifySupportedRuntime() {
    if (!supportedRuntimes.has(this.#runtime)) {
      log.warning()
      log.warning(
        `Warning: found unsupported runtime '${this.#runtime}' for function '${
          this.#functionKey
        }'`,
      )
    }
  }
  #getAwsEnvVars() {
    return {
      AWS_DEFAULT_REGION: this.#region,
      AWS_LAMBDA_FUNCTION_MEMORY_SIZE: this.#memorySize,
      AWS_LAMBDA_FUNCTION_NAME: this.#functionName,
      AWS_LAMBDA_FUNCTION_VERSION: '$LATEST',
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
  #getEnv(providerEnv, functionDefinitionEnv, handler) {
    return {
      ...this.#getAwsEnvVars(),
      ...providerEnv,
      ...functionDefinitionEnv,
      _HANDLER: handler,
      IS_OFFLINE: true,
    }
  }
  setClientContext(clientContext) {
    this.#clientContext = clientContext
  }
  setEvent(event) {
    this.#event = event
  }
  async cleanup() {
    await this.#handlerRunner.cleanup()
    if (this.#lambdaDir) {
      await remove(this.#lambdaDir)
    }
  }
  #executionTimeInMillis() {
    return this.#executionTimeEnded - this.#executionTimeStarted
  }
  #billedExecutionTimeInMillis() {
    return ceil(this.#executionTimeEnded - this.#executionTimeStarted)
  }
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
