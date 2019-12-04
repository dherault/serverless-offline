import { join } from 'path'
import execa from 'execa'
import Artifacts from './artifacts/index.js'
import baseImage from './baseImage.js'
import { supportedRuntimesOnlyWithDocker } from '../config/index.js'
import { checkDockerDaemon } from '../utils/index.js'
import debugLog from '../debugLog.js'

export default class Docker {
  constructor(serverless, options, lambdas) {
    const { service, config } = serverless
    this._providerRuntime = service.provider.runtime

    this._images = new Map()
    this._lambdas = new Map()

    this._artifacts = new Artifacts(serverless, this._lambdas)
    this._servicePath = config.servicePath
    this._dockerfilesDir = join(
      this._servicePath,
      '.serverless',
      'offline',
      'dockerfiles',
    )

    this._setLambdas(lambdas, options)
  }

  _setLambdas(lambdas, options) {
    lambdas.forEach(({ functionKey, functionDefinition }) => {
      const runtime = functionDefinition.runtime || this._providerRuntime
      if (options.useDocker || supportedRuntimesOnlyWithDocker.has(runtime)) {
        this._lambdas.set(functionKey, functionDefinition)
      }
    })
  }

  async initialize() {
    return Promise.all([
      checkDockerDaemon(),
      this._pullBaseImages(),
      this._artifacts.build(),
    ])
  }

  async _pullBaseImages() {
    const pull = []
    const runtimes = new Set()

    this._lambdas.forEach((functionDefinition) => {
      const runtime = functionDefinition.runtime || this._providerRuntime

      if (runtimes.has(runtime)) {
        return
      }
      runtimes.add(runtime)

      const baseImageTag = baseImage(runtime)

      debugLog(`Downloading base Docker image... (${baseImageTag})`)

      pull.push(this._pullImage(baseImageTag))
    })

    return Promise.all(pull)
  }

  async _pullImage(image) {
    try {
      await execa('docker', ['pull', image])
    } catch (err) {
      console.error(err.stderr)
      throw err
    }
  }

  cleanup() {}
}
