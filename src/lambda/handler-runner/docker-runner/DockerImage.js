import execa from 'execa'
import promiseMemoize from 'p-memoize'
import debugLog from '../../../debugLog.js'

export default class DockerImage {
  #imageNameTag = null

  constructor(imageNameTag, v3Utils) {
    this.#imageNameTag = imageNameTag
    if (v3Utils) {
      this.log = v3Utils.log
      this.progress = v3Utils.progress
      this.writeText = v3Utils.writeText
      this.v3Utils = v3Utils
    }
  }

  static async _pullImage(imageNameTag) {
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
      console.error(err.stderr)
      throw err
    }
  }

  async pull() {
    return DockerImage._memoizedPull(this.#imageNameTag)
  }
}

DockerImage._memoizedPull = promiseMemoize(DockerImage._pullImage)
