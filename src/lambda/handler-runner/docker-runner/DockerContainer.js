import execa from 'execa'
import fetch from 'node-fetch'
import { getPortPromise } from 'portfinder'
import { DEFAULT_DOCKER_CONTAINER_PORT } from '../../../config/index.js'
import { baseImage } from '../../../utils/index.js'
import debugLog from '../../../debugLog.js'

const { stringify } = JSON
const { entries } = Object

export default class DockerContainer {
  constructor(env, functionKey, handler, runtime) {
    this._env = env
    this._functionKey = functionKey
    this._runtime = runtime
    this._handler = handler

    this._containerId = null
    this._port = null
  }

  async run(codeDir) {
    const port = await getPortPromise({ port: DEFAULT_DOCKER_CONTAINER_PORT })

    debugLog('Run Docker container...')

    // TODO: support layer
    // https://github.com/serverless/serverless/blob/v1.57.0/lib/plugins/aws/invokeLocal/index.js#L291-L293
    let dockerArgs = [
      '-v',
      `${codeDir}:/var/task:ro,delegated`,
      '-e',
      'DOCKER_LAMBDA_STAY_OPEN=1', // API mode
    ]
    entries(this._env).forEach(([key, value]) => {
      dockerArgs = dockerArgs.concat(['-e', `${key}=${value}`])
    })
    if (process.platform === 'linux') {
      // use host networking to access host service (only works on linux)
      dockerArgs = dockerArgs.concat([
        '--net',
        'host',
        '-e',
        `DOCKER_LAMBDA_API_PORT=${port}`,
      ])
    } else {
      // expose port simply
      // `host.docker.internal` DNS name can be used to access host service
      dockerArgs = dockerArgs.concat(['-p', `${port}:9001`])
    }

    const { stdout: containerId } = await execa('docker', [
      'create',
      ...dockerArgs,
      baseImage(this._runtime),
      this._handler,
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

    this._containerId = containerId
    this._port = port

    return this
  }

  async request(event) {
    const url = `http://localhost:${this._port}/2015-03-31/functions/${this._functionKey}/invocations`
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
    if (this._containerId) {
      try {
        await execa('docker', ['stop', this._containerId])
        await execa('docker', ['rm', this._containerId])
      } catch (err) {
        console.error(err.stderr)
        throw err
      }
    }
  }

  get isRunning() {
    return this._containerId !== null && this._port !== null
  }
}
