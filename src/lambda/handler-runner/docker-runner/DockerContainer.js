import { createHash } from 'node:crypto'
import { createWriteStream, unlinkSync } from 'node:fs'
import { platform } from 'node:os'
import { dirname, join, sep } from 'node:path'
import { Lambda } from 'aws-sdk'
import execa from 'execa'
import { ensureDir, pathExists, readFile, writeFile } from 'fs-extra'
import jszip from 'jszip'
import fetch from 'node-fetch'
import pRetry from 'p-retry'
import DockerImage from './DockerImage.js'
import debugLog from '../../../debugLog.js'
import { logLayers, logWarning } from '../../../serverlessLog.js'

const { stringify } = JSON
const { entries, keys } = Object

export default class DockerContainer {
  #containerId = null
  #dockerOptions = null
  #env = null
  #functionKey = null
  #handler = null
  #image = null
  #imageNameTag = null
  #lambda = null
  #layers = null
  #port = null
  #provider = null
  #runtime = null
  #servicePath = null

  constructor(
    env,
    functionKey,
    handler,
    runtime,
    layers,
    provider,
    servicePath,
    dockerOptions,
    v3Utils,
  ) {
    this.#env = env
    this.#functionKey = functionKey
    this.#handler = handler
    this.#imageNameTag = this.#baseImage(runtime)
    this.#image = new DockerImage(this.#imageNameTag, v3Utils)
    this.#runtime = runtime
    this.#layers = layers
    this.#provider = provider
    this.#servicePath = servicePath
    this.#dockerOptions = dockerOptions
    if (v3Utils) {
      this.log = v3Utils.log
      this.progress = v3Utils.progress
      this.writeText = v3Utils.writeText
      this.v3Utils = v3Utils
    }
  }

  #baseImage(runtime) {
    return `lambci/lambda:${runtime}`
  }

  async start(codeDir) {
    await this.#image.pull()

    if (this.log) {
      this.log.debug('Run Docker container...')
    } else {
      debugLog('Run Docker container...')
    }

    let permissions = 'ro'

    if (!this.#dockerOptions.readOnly) {
      permissions = 'rw'
    }
    // https://github.com/serverless/serverless/blob/v1.57.0/lib/plugins/aws/invokeLocal/index.js#L291-L293
    const dockerArgs = [
      '-v',
      `${codeDir}:/var/task:${permissions},delegated`,
      '-p',
      9001,
      '-e',
      'DOCKER_LAMBDA_STAY_OPEN=1', // API mode
      '-e',
      'DOCKER_LAMBDA_WATCH=1', // Watch mode
    ]

    if (this.#layers.length > 0) {
      if (this.log) {
        this.log.verbose(`Found layers, checking provider type`)
      } else {
        logLayers(`Found layers, checking provider type`)
      }

      if (this.#provider.name.toLowerCase() !== 'aws') {
        if (this.log) {
          this.log.warning(
            `Provider ${
              this.#provider.name
            } is Unsupported. Layers are only supported on aws.`,
          )
        } else {
          logLayers(
            `Provider ${
              this.#provider.name
            } is Unsupported. Layers are only supported on aws.`,
          )
        }
      } else {
        let layerDir = this.#dockerOptions.layersDir

        if (!layerDir) {
          layerDir = join(this.#servicePath, '.serverless-offline', 'layers')
        }

        layerDir = join(layerDir, this.#getLayersSha256())

        if (await pathExists(layerDir)) {
          if (this.log) {
            this.log.verbose(
              `Layers already exist for this function. Skipping download.`,
            )
          } else {
            logLayers(
              `Layers already exist for this function. Skipping download.`,
            )
          }
        } else {
          const layers = []

          if (this.log) {
            this.log.verbose(`Storing layers at ${layerDir}`)
          } else {
            logLayers(`Storing layers at ${layerDir}`)
          }

          // Only initialise if we have layers, we're using AWS, and they don't already exist
          this.#lambda = new Lambda({
            apiVersion: '2015-03-31',
            region: this.#provider.region,
          })

          if (this.log) {
            this.log.verbose(`Getting layers`)
          } else {
            logLayers(`Getting layers`)
          }

          for (const layerArn of this.#layers) {
            layers.push(this.#downloadLayer(layerArn, layerDir))
          }

          await Promise.all(layers)
        }

        if (
          this.#dockerOptions.hostServicePath &&
          layerDir.startsWith(this.#servicePath)
        ) {
          layerDir = layerDir.replace(
            this.#servicePath,
            this.#dockerOptions.hostServicePath,
          )
        }
        dockerArgs.push('-v', `${layerDir}:/opt:ro,delegated`)
      }
    }

    entries(this.#env).forEach(([key, value]) => {
      dockerArgs.push('-e', `${key}=${value}`)
    })

    if (platform() === 'linux') {
      // Add `host.docker.internal` DNS name to access host from inside the container
      // https://github.com/docker/for-linux/issues/264
      const gatewayIp = await this.#getBridgeGatewayIp()
      if (gatewayIp) {
        dockerArgs.push('--add-host', `host.docker.internal:${gatewayIp}`)
      }
    }

    if (this.#dockerOptions.network) {
      dockerArgs.push('--network', this.#dockerOptions.network)
    }

    const { stdout: containerId } = await execa('docker', [
      'create',
      ...dockerArgs,
      this.#imageNameTag,
      this.#handler,
    ])

    const dockerStart = execa('docker', ['start', '-a', containerId], {
      all: true,
    })

    await new Promise((resolve, reject) => {
      dockerStart.all.on('data', (data) => {
        const str = data.toString()
        console.log(str)
        if (str.includes('Lambda API listening on port')) {
          resolve()
        }
      })

      dockerStart.on('error', (err) => {
        reject(err)
      })
    })

    // parse `docker port` output and get the container port
    let containerPort
    const { stdout: dockerPortOutput } = await execa('docker', [
      'port',
      containerId,
    ])
    // NOTE: `docker port` may output multiple lines.
    //
    // e.g.:
    // 9001/tcp -> 0.0.0.0:49153
    // 9001/tcp -> :::49153
    //
    // Parse each line until it finds the mapped port.
    for (const line of dockerPortOutput.split('\n')) {
      const result = line.match(/^9001\/tcp -> (.*):(\d+)$/)
      if (result && result.length > 2) {
        ;[, , containerPort] = result
        break
      }
    }
    if (!containerPort) {
      throw new Error('Failed to get container port')
    }

    this.#containerId = containerId
    this.#port = containerPort

    await pRetry(() => this.#ping(), {
      // default,
      factor: 2,
      // milliseconds
      minTimeout: 10,
      // default
      retries: 10,
    })
  }

  async #downloadLayer(layerArn, layerDir) {
    const layerName = layerArn.split(':layer:')[1]
    const layerZipFile = `${layerDir}/${layerName}.zip`
    const layerProgress = this.log && this.progress.get(`layer-${layerName}`)

    if (this.log) {
      this.log.verbose(`[${layerName}] ARN: ${layerArn}`)
    } else {
      logLayers(`[${layerName}] ARN: ${layerArn}`)
    }

    const params = {
      Arn: layerArn,
    }

    if (this.log) {
      this.log.verbose(`[${layerName}] Getting Info`)
      layerProgress.notice(`Retrieving "${layerName}": Getting info`)
    } else {
      logLayers(`[${layerName}] Getting Info`)
    }
    try {
      let layer = null

      try {
        layer = await this.#lambda.getLayerVersionByArn(params).promise()
      } catch (e) {
        if (this.log) {
          this.log.warning(`[${layerName}] ${e.code}: ${e.message}`)
        } else {
          logWarning(`[${layerName}] ${e.code}: ${e.message}`)
        }
        return
      }

      if (
        Object.prototype.hasOwnProperty.call(layer, 'CompatibleRuntimes') &&
        !layer.CompatibleRuntimes.includes(this.#runtime)
      ) {
        if (this.log) {
          this.log.warning(
            `[${layerName}] Layer is not compatible with ${
              this.#runtime
            } runtime`,
          )
        } else {
          logWarning(
            `[${layerName}] Layer is not compatible with ${
              this.#runtime
            } runtime`,
          )
        }
        return
      }

      const layerUrl = layer.Content.Location
      // const layerSha = layer.Content.CodeSha256

      const layerSize = layer.Content.CodeSize

      await ensureDir(layerDir)

      if (this.log) {
        this.log.verbose(
          `Retrieving "${layerName}": Downloading ${this.#formatBytes(
            layerSize,
          )}...`,
        )
        layerProgress.notice(
          `Retrieving "${layerName}": Downloading ${this.#formatBytes(
            layerSize,
          )}`,
        )
      } else {
        logLayers(
          `[${layerName}] Downloading ${this.#formatBytes(layerSize)}...`,
        )
      }

      const res = await fetch(layerUrl, {
        method: 'get',
      })

      if (!res.ok) {
        if (this.log) {
          this.log.warning(
            `[${layerName}] Failed to fetch from ${layerUrl} with ${res.statusText}`,
          )
        } else {
          logWarning(
            `[${layerName}] Failed to fetch from ${layerUrl} with ${res.statusText}`,
          )
        }
        return
      }

      const fileStream = createWriteStream(`${layerZipFile}`)
      await new Promise((resolve, reject) => {
        res.body.pipe(fileStream)
        res.body.on('error', (err) => {
          reject(err)
        })
        fileStream.on('finish', () => {
          resolve()
        })
      })

      if (this.log) {
        this.log.verbose(
          `Retrieving "${layerName}": Unzipping to .layers directory`,
        )
        layerProgress.notice(
          `Retrieving "${layerName}": Unzipping to .layers directory`,
        )
      } else {
        logLayers(`[${layerName}] Unzipping to .layers directory`)
      }

      const data = await readFile(layerZipFile)
      const zip = await jszip.loadAsync(data)
      await Promise.all(
        keys(zip.files).map(async (filename) => {
          const fileData = await zip.files[filename].async('nodebuffer')
          if (filename.endsWith(sep)) {
            return Promise.resolve()
          }
          await ensureDir(join(layerDir, dirname(filename)))
          return writeFile(join(layerDir, filename), fileData, {
            mode: zip.files[filename].unixPermissions,
          })
        }),
      )

      if (this.log) {
        this.log.verbose(`[${layerName}] Removing zip file`)
      } else {
        logLayers(`[${layerName}] Removing zip file`)
      }

      unlinkSync(layerZipFile)
    } finally {
      if (this.log) layerProgress.remove()
    }
  }

  async #getBridgeGatewayIp() {
    let gateway
    try {
      ;({ stdout: gateway } = await execa('docker', [
        'network',
        'inspect',
        'bridge',
        '--format',
        '{{(index .IPAM.Config 0).Gateway}}',
      ]))
    } catch (err) {
      if (this.log) {
        this.log.error(err.stderr)
      } else {
        console.error(err.stderr)
      }
      throw err
    }
    return gateway.split('/')[0]
  }

  async #ping() {
    const url = `http://${this.#dockerOptions.host}:${
      this.#port
    }/2018-06-01/ping`
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`Failed to fetch from ${url} with ${res.statusText}`)
    }

    return res.text()
  }

  async request(event) {
    const url = `http://${this.#dockerOptions.host}:${
      this.#port
    }/2015-03-31/functions/${this.#functionKey}/invocations`

    const res = await fetch(url, {
      body: stringify(event),
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch from ${url} with ${res.statusText}`)
    }

    return res.json()
  }

  async stop() {
    if (this.#containerId) {
      try {
        await execa('docker', ['stop', this.#containerId])
        await execa('docker', ['rm', this.#containerId])
      } catch (err) {
        if (this.log) {
          this.log.error(err.stderr)
        } else {
          console.error(err.stderr)
        }
        throw err
      }
    }
  }

  #formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
  }

  #getLayersSha256() {
    return createHash('sha256').update(stringify(this.#layers)).digest('hex')
  }

  get isRunning() {
    return this.#containerId !== null && this.#port !== null
  }
}
