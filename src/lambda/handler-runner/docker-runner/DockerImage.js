// import execa from 'execa'
import promiseMemoize from 'p-memoize'
import debugLog from '../../../debugLog.js'
import serverlessLog from '../../../serverlessLog.js'

export default class DockerImage {
  #imageNameTag = null
  #dockerClient = null

  constructor(imageNameTag, dockerClient) {
    this.#imageNameTag = imageNameTag
    this.#dockerClient = dockerClient
  }

  static async _pullImage(imageNameTag, dockerClient) {
    debugLog(`Downloading base Docker image... (${imageNameTag})`)

    try {
      const stream = await dockerClient.pull(imageNameTag, {
        disableContentTrust: false,
      })

      dockerClient.modem.followProgress(
        stream,
        (err) => {
          if (err) {
            throw err
          }
        },
        (event) => {
          const { status, id } = event
          serverlessLog(`${status}${id ? ` - ${id}` : ''}`)
        },
      )
    } catch (err) {
      console.error(err.stderr)
      throw err
    }
  }

  async pull() {
    return DockerImage._memoizedPull(this.#imageNameTag, this.#dockerClient)
  }
}

DockerImage._memoizedPull = promiseMemoize(DockerImage._pullImage)
