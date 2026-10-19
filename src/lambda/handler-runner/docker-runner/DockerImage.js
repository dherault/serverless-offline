import { execa } from "execa"
import promiseMemoize from "p-memoize"
import { log } from "../../../utils/log.js"

export default class DockerImage {
  #imageNameTag = null

  static #memoizedPull = promiseMemoize(DockerImage.#pullImage)

  constructor(imageNameTag) {
    this.#imageNameTag = imageNameTag
  }

  static async #pullImage(imageNameTag) {
    log.debug(`Downloading base Docker image... (${imageNameTag})`)

    try {
      await execa("docker", ["pull", imageNameTag])
    } catch (err) {
      log.error(err.stderr)

      throw err
    }
  }

  async pull() {
    return DockerImage.#memoizedPull(this.#imageNameTag)
  }
}
