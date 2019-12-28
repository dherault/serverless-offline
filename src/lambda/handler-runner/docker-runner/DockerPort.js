import Queue from 'p-queue'
import { getPortPromise } from 'portfinder'
import { DEFAULT_DOCKER_CONTAINER_PORT } from '../../../config/index.js'

export default class DockerPort {
  static #queue = new Queue({ concurrency: 1 })
  static #portScanStart = DEFAULT_DOCKER_CONTAINER_PORT

  async get() {
    return DockerPort.#queue.add(async () => {
      const port = await getPortPromise({ port: DockerPort.#portScanStart })
      DockerPort.#portScanStart = port + 1
      return port
    })
  }
}
