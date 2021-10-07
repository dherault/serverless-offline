import debugLog from '../../debugLog.js'
import { logWarning } from '../../serverlessLog.js'
import {
  supportedNodejs,
  supportedPython,
  supportedRuby,
  supportedJava,
} from '../../config/index.js'
import { satisfiesVersionRange } from '../../utils/index.js'

export default class HandlerRunner {
  #env = null
  #funOptions = null
  #options = null
  #runner = null

  constructor(funOptions, options, env, v3Utils) {
    this.#env = env
    this.#funOptions = funOptions
    this.#options = options
    if (v3Utils) {
      this.log = v3Utils.log
      this.progress = v3Utils.progress
      this.writeText = v3Utils.writeText
      this.v3Utils = v3Utils
    }
  }

  async _loadRunner() {
    const { useDocker, useChildProcesses, useWorkerThreads, allowCache } =
      this.#options

    const { functionKey, handlerName, handlerPath, runtime, timeout } =
      this.#funOptions

    debugLog(`Loading handler... (${handlerPath})`)

    if (useDocker) {
      // https://github.com/lambci/docker-lambda/issues/329
      if (runtime === 'nodejs14.x') {
        if (this.log) {
          this.log.warning(
            '"nodejs14.x" runtime is not supported with docker. See https://github.com/lambci/docker-lambda/issues/329',
          )
        } else {
          logWarning(
            '"nodejs14.x" runtime is not supported with docker. See https://github.com/lambci/docker-lambda/issues/329',
          )
        }
        throw new Error('Unsupported runtime')
      }

      if (runtime === 'python3.9') {
        if (this.log) {
          this.log.warning('"python3.9" runtime is not supported with docker.')
        } else {
          logWarning('"python3.9" runtime is not supported with docker.')
        }
        throw new Error('Unsupported runtime')
      }

      const dockerOptions = {
        host: this.#options.dockerHost,
        hostServicePath: this.#options.dockerHostServicePath,
        layersDir: this.#options.layersDir,
        network: this.#options.dockerNetwork,
        readOnly: this.#options.dockerReadOnly,
      }

      const { default: DockerRunner } = await import('./docker-runner/index.js')
      return new DockerRunner(
        this.#funOptions,
        this.#env,
        dockerOptions,
        this.v3Utils,
      )
    }

    if (supportedNodejs.has(runtime)) {
      if (useChildProcesses) {
        const { default: ChildProcessRunner } = await import(
          './child-process-runner/index.js'
        )
        return new ChildProcessRunner(this.#funOptions, this.#env, allowCache)
      }

      if (useWorkerThreads) {
        // worker threads
        this._verifyWorkerThreadCompatibility()

        const { default: WorkerThreadRunner } = await import(
          './worker-thread-runner/index.js'
        )
        return new WorkerThreadRunner(this.#funOptions, this.#env, allowCache)
      }

      const { default: InProcessRunner } = await import(
        './in-process-runner/index.js'
      )
      return new InProcessRunner(
        functionKey,
        handlerPath,
        handlerName,
        this.#env,
        timeout,
        allowCache,
      )
    }

    if (supportedPython.has(runtime)) {
      const { default: PythonRunner } = await import('./python-runner/index.js')
      return new PythonRunner(this.#funOptions, this.#env, allowCache)
    }

    if (supportedRuby.has(runtime)) {
      const { default: RubyRunner } = await import('./ruby-runner/index.js')
      return new RubyRunner(this.#funOptions, this.#env, allowCache)
    }

    if (supportedJava.has(runtime)) {
      const { default: JavaRunner } = await import('./java-runner/index.js')
      return new JavaRunner(this.#funOptions, this.#env, allowCache)
    }

    // TODO FIXME
    throw new Error('Unsupported runtime')
  }

  _verifyWorkerThreadCompatibility() {
    const { node: currentVersion } = process.versions
    const requiredVersionRange = '>=11.7.0'

    const versionIsSatisfied = satisfiesVersionRange(
      currentVersion,
      requiredVersionRange,
    )

    // we're happy
    if (!versionIsSatisfied) {
      if (this.log) {
        this.log.warning(
          `"worker threads" require node.js version ${requiredVersionRange}, but found version ${currentVersion}.
         To use this feature you have to update node.js to a later version.
        `,
        )
      } else {
        logWarning(
          `"worker threads" require node.js version ${requiredVersionRange}, but found version ${currentVersion}.
         To use this feature you have to update node.js to a later version.
        `,
        )
      }

      throw new Error(
        '"worker threads" are not supported with this node.js version',
      )
    }
  }

  // TEMP TODO FIXME
  isDockerRunner() {
    return this.#runner && this.#runner.constructor.name === 'DockerRunner'
  }

  // () => Promise<void>
  cleanup() {
    // TODO console.log('handler runner cleanup')
    return this.#runner.cleanup()
  }

  async run(event, context) {
    if (this.#runner == null) {
      this.#runner = await this._loadRunner()
    }

    return this.#runner.run(event, context)
  }
}
