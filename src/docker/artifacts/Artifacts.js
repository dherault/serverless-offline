import { join, basename, extname, dirname, sep } from 'path'
import { readFile, writeFile, ensureDir, emptyDir } from 'fs-extra'
import jszip from 'jszip'
import debugLog from '../../debugLog.js'

export default class Artifacts {
  constructor(serverless, lambdas) {
    const { service, config, pluginManager } = serverless
    this._service = service
    this._config = config
    this._pluginManager = pluginManager
    this._lambdas = lambdas

    this._serviceArtifact = null
    this._functionArtifacts = new Map()

    this._artifactsDir = join(
      config.servicePath,
      '.serverless',
      'offline',
      'artifacts',
    )
  }

  async build() {
    debugLog('Build artifacts...')

    if (this._checkPackageConfigExists()) {
      await this._package()
    }
    return this._extractAllArtifacts()
  }

  _checkPackageConfigExists() {
    const check = (config) => {
      if (config.package && Object.keys(config.package).length > 0) {
        return true
      }
      return false
    }

    if (check(this._service)) {
      return true
    }

    for (const functionDefinition of this._lambdas.values()) {
      if (check(functionDefinition)) {
        return true
      }
    }

    return false
  }

  _package() {
    return this._pluginManager.spawn('package')
  }

  _extractAllArtifacts() {
    const extract = []

    const serviceArtifact = this._service.package
      ? this._service.package.artifact
      : null
    if (serviceArtifact) {
      extract.push(
        this._extractArtifact(serviceArtifact).then((artifactPath) => {
          this._serviceArtifact = artifactPath
        }),
      )
    } else {
      this._serviceArtifact = this._config.servicePath
    }

    this._lambdas.forEach((functionDefinition, functionKey) => {
      const artifact = functionDefinition.package
        ? functionDefinition.package.artifact
        : null
      if (artifact) {
        extract.push(
          this._extractArtifact(artifact).then((artifactPath) => {
            this._functionArtifacts.set(functionKey, artifactPath)
          }),
        )
      }
    })

    return Promise.all(extract)
  }

  // extractArtifact, loosely based on:
  // https://github.com/serverless/serverless/blob/v1.57.0/lib/plugins/aws/invokeLocal/index.js#L312
  async _extractArtifact(artifact) {
    const artifactDir = join(
      this._artifactsDir,
      basename(artifact, extname(artifact)),
    )
    const data = await readFile(artifact)
    const zip = await jszip.loadAsync(data)
    await Promise.all(
      Object.keys(zip.files).map(async (filename) => {
        const fileData = await zip.files[filename].async('nodebuffer')
        if (filename.endsWith(sep)) {
          return Promise.resolve()
        }
        await ensureDir(join(artifactDir, dirname(filename)))
        return writeFile(join(artifactDir, filename), fileData, {
          mode: zip.files[filename].unixPermissions,
        })
      }),
    )
    return artifactDir
  }

  get(functionKey) {
    const functionArtifact = this._functionArtifacts.get(functionKey)
    if (functionArtifact) {
      return functionArtifact
    }

    return this._serviceArtifact
  }

  cleanup() {
    this._serviceArtifact = null
    this._functionArtifacts.clear()
    return emptyDir(this._artifactsDir)
  }
}
