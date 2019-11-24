import { join, relative } from 'path'
import { writeFile, ensureDir } from 'fs-extra'
import execa from 'execa'
import DockerContainer from './DockerContainer.js'
import Artifacts from './artifacts/index.js'
import baseImage from './baseImage.js'
import {
  DOCKER_IMAGE_NAME,
  supportedRuntimesOnlyWithDocker,
} from '../config/index.js'
import { checkDockerDaemon } from '../utils/index.js'
import debugLog from '../debugLog.js'
import { logWarning } from '../serverlessLog.js'

const { entries } = Object

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

  async get(functionKey, env) {
    const image = await this._getImage(functionKey, env)
    const { handler } = this._lambdas.get(functionKey)

    const container = new DockerContainer(functionKey, image, handler)

    return container.run()
  }

  async _getImage(functionKey, env) {
    let image = this._images.get(functionKey)
    if (image) {
      return image
    }

    image = await this._buildImage(functionKey, env)
    return image
  }

  async _buildImage(functionKey, env) {
    const runtime =
      this._lambdas.get(functionKey).runtime || this._providerRuntime
    const artifactPath =
      relative(this._artifacts.get(functionKey), this._servicePath) || '.'

    // TODO: support layer
    // https://github.com/serverless/serverless/blob/v1.57.0/lib/plugins/aws/invokeLocal/index.js#L291-L293
    let dockerfile = `FROM ${baseImage(runtime)}`
    dockerfile += '\nENV DOCKER_LAMBDA_STAY_OPEN=1' // API mode
    entries(env).forEach(([key, value]) => {
      dockerfile += ` ${key}="${value}"`
    })
    dockerfile += `\nADD --chown=sbx_user1051:495 ${artifactPath} /var/task`

    const dockerfileDir = join(this._dockerfilesDir, functionKey)
    await ensureDir(dockerfileDir)

    const dockerfilePath = join(dockerfileDir, 'Dockerfile')
    await writeFile(dockerfilePath, dockerfile)

    const imageTag = `${DOCKER_IMAGE_NAME}:${functionKey}`

    debugLog(`Build Docker image... (${imageTag})`)

    let imageId

    try {
      const { stdout } = await execa('docker', [
        'build',
        '-q',
        '-t',
        imageTag,
        '-f',
        dockerfilePath,
        this._servicePath,
      ])

      imageId = stdout
    } catch (err) {
      console.error(err.stderr)
      throw err
    }

    this._images.set(functionKey, imageId)

    return imageId
  }

  async cleanup() {
    if (this._images.size === 0) {
      return
    }

    const images = []
    this._images.forEach((image) => {
      images.push(image)
    })

    try {
      await execa('docker', ['rmi', ...images])
    } catch (err) {
      logWarning(`Failed to remove docker images: ${err.stderr}`)
    }

    this._images.clear()
  }
}
