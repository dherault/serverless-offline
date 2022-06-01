import { execa } from 'execa'
// TODO FIXME eslint plugin import bug, or not supporting package.json "expprts" field?
// eslint-disable-next-line import/no-unresolved
import promiseMemoize from 'p-memoize'

export default class DockerImage {
  #imageNameTag = null

  static #memoizedPull = promiseMemoize(DockerImage.#pullImage)

  constructor(imageNameTag, v3Utils) {
    this.#imageNameTag = imageNameTag

    this.log = v3Utils.log
    this.v3Utils = v3Utils
  }

  static async #pullImage(imageNameTag, v3Utils) {
    v3Utils.log.debug(`Downloading base Docker image... (${imageNameTag})`)

    try {
      await execa('docker', [
        'pull',
        '--disable-content-trust=false',
        imageNameTag,
      ])
    } catch (err) {
      v3Utils.log.error(err.stderr)

      throw err
    }
  }

  async pull() {
    return DockerImage.#memoizedPull(this.#imageNameTag, this.v3Utils)
  }
}
