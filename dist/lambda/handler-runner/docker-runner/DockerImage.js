import { log } from '@serverless/utils/log.js'
import { execa } from 'execa'
import promiseMemoize from 'p-memoize'
export default class DockerImage {
  #imageNameTag = null
  static #memoizedPull = promiseMemoize(DockerImage.#pullImage)
  constructor(imageNameTag) {
    this.#imageNameTag = imageNameTag
  }
  static async #pullImage(imageNameTag) {
    log.debug(`Downloading base Docker image... (${imageNameTag})`)
    try {
      await execa('docker', [
        'pull',
        '--disable-content-trust=false',
        imageNameTag,
      ])
    } catch (err) {
      log.error(err.stderr)
      throw err
    }
  }
  async pull() {
    return DockerImage.#memoizedPull(this.#imageNameTag)
  }
}
