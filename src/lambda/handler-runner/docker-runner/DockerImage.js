import { execa } from "execa"
// TODO FIXME eslint plugin import bug, or not supporting package.json "expprts" field?
// eslint-disable-next-line import/no-unresolved
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
