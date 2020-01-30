import { platform } from 'os'
import execa from 'execa'
import fetch from 'node-fetch'
import DockerClient from 'dockerode'
import stream from 'stream'
import DockerImage from './DockerImage.js'
import DockerPort from './DockerPort.js'
import debugLog from '../../../debugLog.js'

const { stringify } = JSON
const { entries } = Object

export default class DockerContainer {
  static #dockerPort = new DockerPort()

  #containerId = null
  #env = null
  #functionKey = null
  #handler = null
  #imageNameTag = null
  #image = null
  #port = null
  #dockerClient = null

  constructor(env, functionKey, handler, runtime) {
    this.#env = env
    this.#functionKey = functionKey
    this.#handler = handler
    this.#imageNameTag = this._baseImage(runtime)
    this.#dockerClient = new DockerClient()
    this.#image = new DockerImage(this.#imageNameTag, this.#dockerClient)
  }

  _baseImage(runtime) {
    return `lambci/lambda:${runtime}`
  }

  async start(codeDir) {
    const [, port] = await Promise.all([
      this.#image.pull(),
      DockerContainer.#dockerPort.get(),
    ])

    debugLog('Run Docker container...')

    // TODO: support layer
    // https://github.com/serverless/serverless/blob/v1.57.0/lib/plugins/aws/invokeLocal/index.js#L291-L293

    const envs = ['DOCKER_LAMBDA_STAY_OPEN=1']
    entries(this.#env).forEach(([key, value]) => {
      envs.push(`${key}=${value}`)
    })

    const dockerArgs = {
      Image: this.#imageNameTag,
      Env: envs,
      ExposedPorts: {
        '9001/tcp': { HostPort: `${port}` },
      },
      HostConfig: {
        PortBindings: { '9001/tcp': [{ HostPort: `${port}` }] },
        Binds: [`${codeDir}:/var/task:ro,delegated`],
      },
      AttachStdin: false,
      AttachStdout: true,
      AttachStderr: true,
    }

    if (platform() === 'linux') {
      // Add `host.docker.internal` DNS name to access host from inside the container
      // https://github.com/docker/for-linux/issues/264
      const gatewayIp = await this._getBridgeGatewayIp()
      dockerArgs.HostConfig.ExtraHosts = [`host.docker.internal:${gatewayIp}`]
    }

    const container = await this.#dockerClient.createContainer(dockerArgs)

    const containerLogs = (runningContainer) => {
      return new Promise((resolve, reject) => {
        // create a single stream for stdin and stdout
        const logStream = new stream.PassThrough()

        logStream.on('data', (chunk) => {
          if (chunk.toString('utf8').includes('Lambda API listening on port')) {
            resolve()
          }
        })

        runningContainer.logs(
          {
            follow: true,
            stdout: true,
            stderr: true,
          },
          (err, strm) => {
            if (err) {
              reject(err)
              return console.error(err.message)
            }
            runningContainer.modem.demuxStream(strm, logStream, logStream)
            strm.on('end', () => {
              logStream.end()
              resolve()
            })

            return setTimeout(() => {
              strm.destroy()
              reject(new Error('log timeout'))
            }, 3000)
          },
        )
      })
    }

    await container.start()

    await containerLogs(container)

    this.#containerId = container.id
    this.#port = port
  }

  async _getBridgeGatewayIp() {
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
      console.error(err.stderr)
      throw err
    }
    return gateway.split('/')[0]
  }

  async request(event) {
    const url = `http://localhost:${this.#port}/2015-03-31/functions/${
      this.#functionKey
    }/invocations`

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
    if (await this.isRunning()) {
      try {
        await this.#dockerClient.getContainer(this.#containerId).kill()
      } catch (err) {
        console.error(err)
        throw err
      }
    }
  }

  async isRunning() {
    if (this.#containerId !== null && this.#port !== null) {
      try {
        const { State } = await this.#dockerClient
          .getContainer(this.#containerId)
          .inspect()
        return State.Status === 'running'
      } catch (err) {
        console.error(err)
      }
    }

    return false
  }
}
