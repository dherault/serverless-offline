import debugLog from '../../debugLog.js'
import { logWarning } from '../../serverlessLog.js'
import {
  supportedNodejs,
  supportedPython,
  supportedRuby,
  supportedRuntimesWithDocker,
} from '../../config/index.js'
import { satisfiesVersionRange } from '../../utils/index.js'

export default class HandlerRunner {
  constructor(funOptions, options, env) {
    this._env = env
    this._funOptions = funOptions
    this._options = options
    this._runner = null
    this._useDocker = false
  }

  async _loadRunner() {
    const { useDocker, useChildProcesses, useWorkerThreads } = this._options

    const {
      functionKey,
      handlerName,
      handlerPath,
      runtime,
      timeout,
    } = this._funOptions

    debugLog(`Loading handler... (${handlerPath})`)

    if (useDocker && supportedRuntimesWithDocker.has(runtime)) {
      this._useDocker = true
      const { default: DockerRunner } = await import('./DockerRunner.js')
      return new DockerRunner(this._funOptions, this._env)
    }

    if (supportedNodejs.has(runtime)) {
      if (useChildProcesses) {
        const { default: ChildProcessRunner } = await import(
          './child-process-runner/index.js'
        )
        return new ChildProcessRunner(this._funOptions, this._env)
      }

      if (useWorkerThreads) {
        // worker threads
        this._verifyWorkerThreadCompatibility()

        const { default: WorkerThreadRunner } = await import(
          './worker-thread-runner/index.js'
        )
        return new WorkerThreadRunner(this._funOptions, this._env)
      }

      const { default: InProcessRunner } = await import(
        './in-process-runner/index.js'
      )
      return new InProcessRunner(
        functionKey,
        handlerPath,
        handlerName,
        this._env,
        timeout,
      )
    }

    if (supportedPython.has(runtime)) {
      const { default: PythonRunner } = await import('./python-runner/index.js')
      return new PythonRunner(this._funOptions, this._env)
    }

    if (supportedRuby.has(runtime)) {
      const { default: RubyRunner } = await import('./ruby-runner/index.js')
      return new RubyRunner(this._funOptions, this._env)
    }

    if (supportedRuntimesWithDocker.has(runtime)) {
      this._useDocker = true
      const { default: DockerRunner } = await import('./DockerRunner.js')
      return new DockerRunner(this._funOptions, this._env)
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
      logWarning(
        `"worker threads" require node.js version ${requiredVersionRange}, but found version ${currentVersion}.
         To use this feature you have to update node.js to a later version.
        `,
      )

      throw new Error(
        '"worker threads" are not supported with this node.js version',
      )
    }
  }

  isDockerRunner() {
    if (!this._runner) {
      return false
    }
    return this._useDocker
  }

  // () => Promise<void>
  cleanup() {
    // TODO console.log('handler runner cleanup')
    return this._runner.cleanup()
  }

  async run(event, context) {
    if (this._runner == null) {
      this._runner = await this._loadRunner()
    }

    return this._runner.run(event, context)
  }
}
