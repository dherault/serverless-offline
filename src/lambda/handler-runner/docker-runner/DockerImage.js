import { execa } from 'execa'
// TODO FIXME eslint plugin import bug, or not supporting package.json "expprts" field?
// eslint-disable-next-line import/no-unresolved
import promiseMemoize from 'p-memoize'
import debugLog from '../../../debugLog.js'

export default class DockerImage {
  #imageNameTag = null

  static #memoizedPull = promiseMemoize(DockerImage.#pullImage)

  constructor(imageNameTag, v3Utils) {
    this.#imageNameTag = imageNameTag

    if (v3Utils) {
      this.log = v3Utils.log
      this.progress = v3Utils.progress
      this.writeText = v3Utils.writeText
      this.v3Utils = v3Utils
    }
  }

  static async #pullImage(imageNameTag) {
    if (this.log) {
      this.log.debug(`Downloading base Docker image... (${imageNameTag})`)
    } else {
      debugLog(`Downloading base Docker image... (${imageNameTag})`)
    }

    try {
      await execa('docker', [
        'pull',
        '--disable-content-trust=false',
        imageNameTag,
      ])
    } catch (err) {
      if (this.log) {
        this.log.error(err.stderr)
      } else {
        console.error(err.stderr)
      }
      throw err
    }
  }

  async pull() {
    return DockerImage.#memoizedPull(this.#imageNameTag, this.v3Utils)
  }
}
