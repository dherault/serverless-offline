import { join, dirname, sep } from 'path'
import { readFile, writeFile, ensureDir, remove } from 'fs-extra'
import jszip from 'jszip'
import DockerContainer from './DockerContainer.js'
import { createUniqueId } from '../../../utils/index.js'

export default class DockerRunner {
  constructor(funOptions, env) {
    const { functionKey, handler, runtime, servicePath, artifact } = funOptions
    this._functionKey = functionKey
    this._servicePath = servicePath
    this._artifact = artifact
    this._container = new DockerContainer(env, functionKey, handler, runtime)

    // volume directory contains code and layers
    this._volumeDir = join(
      this._servicePath,
      '.serverless',
      'offline',
      this._functionKey,
      createUniqueId(),
    )
  }

  async cleanup() {
    if (this._container) {
      await this._container.stop()
      return remove(this._volumeDir)
    }
    return Promise.resolve()
  }

  // context will be generated in container
  async run(event) {
    if (!this._container.isRunning) {
      const codeDir = await this._extractArtifact()
      await this._container.start(codeDir)
    }

    return this._container.request(event)
  }

  // extractArtifact, loosely based on:
  // https://github.com/serverless/serverless/blob/v1.57.0/lib/plugins/aws/invokeLocal/index.js#L312
  async _extractArtifact() {
    if (this._artifact) {
      const codeDir = join(this._volumeDir, 'code')
      const data = await readFile(this._artifact)
      const zip = await jszip.loadAsync(data)
      await Promise.all(
        Object.keys(zip.files).map(async (filename) => {
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

    return this._servicePath
  }
}
