import { createHash } from "node:crypto"
import { existsSync } from "node:fs"
import { rm, writeFile } from "node:fs/promises"
import { platform } from "node:os"
import { join } from "node:path"
import { LambdaClient, GetLayerVersionCommand } from "@aws-sdk/client-lambda"
import { execa } from "execa"
import isWsl from "is-wsl"
import { log, progress } from "../../../utils/log.js"
import DockerImage from "./DockerImage.js"
import Runtime from "./DockerRuntime.js"
import {
  extractLayerZip,
  extractLocalLayer,
  hashLocalLayer,
  resolveLocalLayerPath,
} from "./layerSources.js"
import parseLayerArn from "./parseLayerArn.js"

const { stringify } = JSON
const { floor, log: mathLog } = Math
const { parseFloat } = Number
const { entries, hasOwn } = Object

export default class DockerContainer {
  #containerId = null

  #dockerOptions = null

  #env = null

  #handler = null

  #image = null

  #imageNameTag = null

  #lambdaClient = null

  #layers = null

  #port = null

  #provider = null

  #runtime = null

  #architecture = null

  #servicePath = null

  constructor(
    env,
    handler,
    runtime,
    architecture,
    layers,
    provider,
    servicePath,
    dockerOptions,
  ) {
    this.#dockerOptions = dockerOptions
    this.#env = env
    this.#handler = handler
    this.#imageNameTag = this.#baseImage(runtime, architecture)
    this.#image = new DockerImage(this.#imageNameTag)
    this.#layers = layers
    this.#provider = provider
    this.#runtime = runtime
    this.#architecture = architecture
    this.#servicePath = servicePath
  }

  #baseImage(runtime, architecture) {
    const runtimeImageTag = new Runtime().getImageNameTag(runtime, architecture)
    // # Gets the ECR image format like `python:3.7` or `nodejs:16-x86_64`
    return `public.ecr.aws/lambda/${runtimeImageTag}`
  }

  async start(codeDir) {
    await this.#image.pull()
    log.debug("Run Docker container...")

    let permissions = "ro"

    if (!this.#dockerOptions.readOnly) {
      permissions = "rw"
    }
    // https://github.com/serverless/serverless/blob/v1.57.0/lib/plugins/aws/invokeLocal/index.js#L291-L293
    const dockerArgs = [
      "-v",
      `${codeDir}:/var/task:${permissions},delegated`,
      "-p",
      8080,
      "-e",
      "DOCKER_LAMBDA_STAY_OPEN=1", // API mode
      "-e",
      "DOCKER_LAMBDA_WATCH=1", // Watch mode
    ]
    let layerDir = null

    if (this.#layers.length > 0) {
      log.verbose(`Found layers, checking provider type`)

      if (this.#provider.name.toLowerCase() === "aws") {
        layerDir = await this.#extractLayers()

        // AWS extracts layers into /opt
        // https://docs.aws.amazon.com/lambda/latest/dg/chapter-layers.html
        dockerArgs.push("-v", `${this.#hostPath(layerDir)}:/opt:ro,delegated`)
      } else {
        log.warning(
          `Provider ${this.#provider.name} is Unsupported. Layers are only supported on aws.`,
        )
      }
    }

    // the lambda base images run /var/runtime/bootstrap, while AWS looks for
    // the bootstrap of a custom runtime in the function code first and in the
    // layers second
    // https://docs.aws.amazon.com/lambda/latest/dg/runtimes-custom.html
    log.debug("Looking for bootstrap file")

    const serviceBootstrap = join(this.#servicePath, "bootstrap")
    const layerBootstrap = layerDir && join(layerDir, "bootstrap")

    if (existsSync(serviceBootstrap)) {
      log.debug(`Found bootstrap file at ${serviceBootstrap}`)
      dockerArgs.push(
        "-v",
        `${this.#hostPath(serviceBootstrap)}:/var/runtime/bootstrap:ro,delegated`,
      )
    } else if (
      layerBootstrap &&
      this.#runtime.startsWith("provided") &&
      existsSync(layerBootstrap)
    ) {
      log.debug(`Found bootstrap file at ${layerBootstrap}`)
      dockerArgs.push(
        "-v",
        `${this.#hostPath(layerBootstrap)}:/var/runtime/bootstrap:ro,delegated`,
      )
    }

    entries(this.#env).forEach(([key, value]) => {
      dockerArgs.push("-e", `${key}=${value}`)
    })

    if (platform() === "linux" && !isWsl) {
      // Add `host.docker.internal` DNS name to access host from inside the container
      // https://github.com/docker/for-linux/issues/264
      const gatewayIp = await this.#getBridgeGatewayIp()
      if (gatewayIp) {
        dockerArgs.push("--add-host", `host.docker.internal:${gatewayIp}`)
      }
    }

    if (this.#dockerOptions.network) {
      dockerArgs.push("--network", this.#dockerOptions.network)
    }

    const { stdout: containerId } = await execa("docker", [
      "create",
      ...dockerArgs,
      this.#imageNameTag,
      this.#handler,
    ])

    const dockerStart = execa("docker", ["start", "-a", containerId], {
      all: true,
    })

    await new Promise((resolve, reject) => {
      dockerStart.all.on("data", (data) => {
        const str = String(data)
        log.error(str)

        if (str.includes("(cwd=/var/task, handler=)")) {
          resolve()
        }
      })

      dockerStart.on("error", (err) => {
        reject(err)
      })
    })

    // parse `docker port` output and get the container port
    let containerPort
    const { stdout: dockerPortOutput } = await execa("docker", [
      "port",
      containerId,
    ])
    // NOTE: `docker port` may output multiple lines.
    //
    // e.g.:
    // 8080/tcp -> 0.0.0.0:49153
    // 8080/tcp -> :::49153
    //
    // Parse each line until it finds the mapped port.
    for (const line of dockerPortOutput.split("\n")) {
      const result = line.match(/^8080\/tcp -> (.*):(\d+)$/)
      if (result && result.length > 2) {
        ;[, , containerPort] = result
        break
      }
    }
    if (!containerPort) {
      throw new Error("Failed to get container port")
    }

    this.#containerId = containerId
    this.#port = containerPort
  }

  // paths are passed to the docker daemon, which does not necessarily share
  // the file system of the process running serverless-offline
  #hostPath(path) {
    if (
      this.#dockerOptions.hostServicePath &&
      path.startsWith(this.#servicePath)
    ) {
      return path.replace(
        this.#servicePath,
        this.#dockerOptions.hostServicePath,
      )
    }

    return path
  }

  async #extractLayers() {
    const layersDir =
      this.#dockerOptions.layersDir ??
      join(this.#servicePath, ".serverless-offline", "layers")

    const layerDir = join(layersDir, await this.#getLayersSha256())
    // the layer directory is created before the layers are downloaded and
    // extracted, its existence alone does not make it usable
    const completedFile = `${layerDir}.completed`

    if (existsSync(completedFile)) {
      log.verbose(`Layers already exist for this function. Skipping download.`)

      return layerDir
    }

    await rm(layerDir, { force: true, recursive: true })

    log.verbose(`Storing layers at ${layerDir}`)

    log.verbose(`Getting layers`)

    const results = []

    // AWS applies layers in their configured order. Extracting sequentially
    // preserves that behavior when later layers overwrite earlier files.
    for (const layerArn of this.#layers) {
      // eslint-disable-next-line no-await-in-loop
      results.push(await this.#retrieveLayer(layerArn, layerDir))
    }

    if (results.every(Boolean)) {
      await writeFile(completedFile, "")
    } else {
      log.warning(
        "Some layers could not be retrieved, they will be downloaded again on the next start",
      )
    }

    return layerDir
  }

  async #retrieveLayer(layerArn, layerDir) {
    const localLayerPath = resolveLocalLayerPath(
      this.#dockerOptions.localLayers,
      layerArn,
      this.#dockerOptions.localLayersRoot,
    )

    if (localLayerPath) {
      log.verbose(`[${layerArn}] Using local layer source ${localLayerPath}`)
      await extractLocalLayer(localLayerPath, layerDir)
      return true
    }

    // Only initialise the AWS client when at least one layer needs downloading.
    this.#lambdaClient ??= new LambdaClient({
      apiVersion: "2015-03-31",
      region: this.#provider.region,
    })

    return this.#downloadLayer(layerArn, layerDir)
  }

  async #downloadLayer(layerArn, layerDir) {
    const parsedLayerArn = parseLayerArn(layerArn)

    if (!parsedLayerArn) {
      log.warning(
        `Skipping layer, expected the ARN of a layer version, got: ${stringify(layerArn)}`,
      )

      return false
    }

    const { name, unversionedArn, version } = parsedLayerArn
    const layerName = `${name}:${version}`
    const layerProgress = progress.get(`layer-${layerName}`)

    log.verbose(`[${layerName}] ARN: ${layerArn}`)

    log.verbose(`[${layerName}] Getting Info`)
    layerProgress.notice(`Retrieving "${layerName}": Getting info`)

    const getLayerVersionCommand = new GetLayerVersionCommand({
      LayerName: unversionedArn,
      VersionNumber: version,
    })

    try {
      let layer = null

      try {
        layer = await this.#lambdaClient.send(getLayerVersionCommand)
      } catch (err) {
        log.warning(`[${layerName}] ${err.code}: ${err.message}`)

        return false
      }

      if (
        hasOwn(layer, "CompatibleRuntimes") &&
        !layer.CompatibleRuntimes.includes(this.#runtime)
      ) {
        log.warning(
          `[${layerName}] Layer is not compatible with ${this.#runtime} runtime`,
        )

        // nothing to extract, but nothing went wrong either
        return true
      }

      const { CodeSize: layerSize, Location: layerUrl } = layer.Content
      // const layerSha = layer.Content.CodeSha256

      log.verbose(
        `Retrieving "${layerName}": Downloading ${this.#formatBytes(
          layerSize,
        )}...`,
      )
      layerProgress.notice(
        `Retrieving "${layerName}": Downloading ${this.#formatBytes(
          layerSize,
        )}`,
      )

      const res = await fetch(layerUrl)

      if (!res.ok) {
        log.warning(
          `[${layerName}] Failed to fetch from ${layerUrl} with ${res.statusText}`,
        )

        return false
      }

      log.verbose(`Retrieving "${layerName}": Unzipping to ${layerDir}`)
      layerProgress.notice(
        `Retrieving "${layerName}": Unzipping to .layers directory`,
      )

      await extractLayerZip(await res.arrayBuffer(), layerDir)

      return true
    } finally {
      layerProgress.remove()
    }
  }

  async #getBridgeGatewayIp() {
    let gateway
    try {
      ;({ stdout: gateway } = await execa("docker", [
        "network",
        "inspect",
        "bridge",
        "--format",
        "{{(index .IPAM.Config 0).Gateway}}",
      ]))
    } catch (err) {
      log.error(err.stderr)

      throw err
    }
    return gateway.split("/")[0]
  }

  async request(event) {
    const url = `http://${this.#dockerOptions.host}:${this.#port}/2015-03-31/functions/function/invocations`

    const res = await fetch(url, {
      body: stringify(event),
      headers: { "Content-Type": "application/json" },
      method: "post",
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch from ${url} with ${res.statusText}`)
    }

    return res.json()
  }

  async stop() {
    if (this.#containerId) {
      try {
        await execa("docker", ["stop", this.#containerId])
        await execa("docker", ["rm", this.#containerId])
      } catch (err) {
        log.error(err.stderr)

        throw err
      }
    }
  }

  #formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = floor(mathLog(bytes) / mathLog(k))

    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
  }

  async #getLayersSha256() {
    const hash = createHash("sha256").update(stringify(this.#layers))

    const localLayerHashes = await Promise.all(
      this.#layers.map(async (layerArn) => {
        const localLayerPath = resolveLocalLayerPath(
          this.#dockerOptions.localLayers,
          layerArn,
          this.#dockerOptions.localLayersRoot,
        )

        return localLayerPath ? hashLocalLayer(localLayerPath) : null
      }),
    )

    for (const localLayerHash of localLayerHashes) {
      if (localLayerHash) {
        hash.update(localLayerHash)
      }
    }

    return hash.digest("hex")
  }

  get isRunning() {
    return this.#containerId !== null && this.#port !== null
  }
}
