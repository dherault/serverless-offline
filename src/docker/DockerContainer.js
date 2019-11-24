import execa from 'execa'
import fetch from 'node-fetch'
import { getPortPromise } from 'portfinder'
import { DEFAULT_DOCKER_CONTAINER_PORT } from '../config/index.js'
import debugLog from '../debugLog.js'

const { stringify } = JSON

export default class DockerContainer {
  constructor(functionKey, image, handler) {
    this._functionKey = functionKey
    this._image = image
    this._handler = handler

    this._containerId = null
    this._port = null
  }

  async run() {
    const port = await getPortPromise({ port: DEFAULT_DOCKER_CONTAINER_PORT })

    debugLog(`Run Docker container... (${this._image})`)

    const { stdout: containerId } = await execa('docker', [
      'create',
      '-p',
      `${port}:9001`,
      this._image,
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
      method: 'post',
      body: stringify(event),
      headers: { 'Content-Type': 'application/json' },
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
}
