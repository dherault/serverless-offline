import { dirname, join, sep } from 'path'
import { readFile, writeFile, ensureDir, remove } from 'fs-extra'
import jszip from 'jszip'
import os from 'os'
import DockerContainer from './DockerContainer.js'
import { checkDockerDaemon, createUniqueId } from '../../../utils/index.js'

const { keys } = Object

export default class DockerRunner {
  #container = null
  #servicePath = null
  #volumeDir = null

  constructor(funOptions, env) {
    const {
      // artifact,
      functionKey,
      handler,
      runtime,
      servicePath,
    } = funOptions

    // this._artifact = artifact
    this.#container = new DockerContainer(env, functionKey, handler, runtime)
    this.#servicePath = servicePath

    // volume directory contains code and layers
    this.#volumeDir = join(
      os.tmpdir(),
      'offline',
      functionKey,
      createUniqueId(),
    )
  }

  async cleanup() {
    if (this.#container) {
      await this.#container.stop()
      return remove(this.#volumeDir)
    }

    return undefined
  }

  // extractArtifact, loosely based on:
  // https://github.com/serverless/serverless/blob/v1.57.0/lib/plugins/aws/invokeLocal/index.js#L312
  async _extractArtifact() {
    if (this._artifact) {
      const codeDir = join(this.#volumeDir, 'code')
      const data = await readFile(this._artifact)
      const zip = await jszip.loadAsync(data)
      await Promise.all(
        keys(zip.files).map(async (filename) => {
          const fileData = await zip.files[filename].async('nodebuffer')
          if (filename.endsWith(sep)) {
            return Promise.resolve()
          }
          await ensureDir(join(codeDir, dirname(filename)))
          return writeFile(join(codeDir, filename), fileData, {
            mode: zip.files[filename].unixPermissions,
          })
        }),
      )
      return codeDir
    }

    return this.#servicePath
  }

  // context will be generated in container
  async run(event) {
    // FIXME TODO this should run only once -> static private
    await checkDockerDaemon()
    if (!(await this.#container.isRunning())) {
      const codeDir = await this._extractArtifact()
      await this.#container.start(codeDir)
    }
    return this.#container.request(event)
  }
}
