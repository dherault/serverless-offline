import execa from 'execa'
import debugLog from '../../../debugLog.js'

export default class DockerImage {
  constructor(imageNameTag) {
    this._imageNameTag = imageNameTag
  }

  async _pullImage() {
    debugLog(`Downloading base Docker image... (${this._imageNameTag})`)

    try {
      await execa('docker', [
        'pull',
        '--disable-content-trust=false',
        this._imageNameTag,
      ])
    } catch (err) {
      console.error(err.stderr)
      throw err
    }
  }

  _waitForImagePull() {
    // TODO should we add a timeout?
    const checkStatus = (resolve) => {
      setTimeout(() => {
        if (DockerImage._pulled.has(this._imageNameTag)) {
          resolve()
          return
        }

        checkStatus(resolve)
      }, 500)
    }

    return new Promise(checkStatus)
  }

  async pull() {
    if (!DockerImage._requested.has(this._imageNameTag)) {
      DockerImage._requested.add(this._imageNameTag)
      await this._pullImage()
      DockerImage._pulled.add(this._imageNameTag)
    }

    if (!DockerImage._pulled.has(this._imageNameTag)) {
      // image pulling in progress
      await this._waitForImagePull()
    }
  }
}

// "static private"
DockerImage._pulled = new Set()
DockerImage._requested = new Set()
