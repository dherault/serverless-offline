import Queue from 'p-queue'
import { getPortPromise } from 'portfinder'
import { DEFAULT_DOCKER_CONTAINER_PORT } from '../../../config/index.js'

export default class DockerPort {
  async get() {
    return DockerPort._queue.add(async () => {
      // assign to "static" private
      const port = await getPortPromise({ port: DockerPort._portScanStart })
      DockerPort._portScanStart = port + 1
      return port
    })
  }
}

// static private
DockerPort._queue = new Queue({ concurrency: 1 })
DockerPort._portScanStart = DEFAULT_DOCKER_CONTAINER_PORT
