import { createHash } from "node:crypto"
import { createWriteStream } from "node:fs"
import { readFile, unlink, writeFile } from "node:fs/promises"
import { platform } from "node:os"
import { dirname, join, sep } from "node:path"
import { LambdaClient, GetLayerVersionCommand } from "@aws-sdk/client-lambda"
import { log, progress } from "@serverless/utils/log.js"
import { execa } from "execa"
import { ensureDir, pathExists } from "fs-extra"
import isWsl from "is-wsl"
import jszip from "jszip"
import DockerImage from "./DockerImage.js"
import Runtime from "./DockerRuntime.js"

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
    if (this.#layers.length > 0) {
      log.verbose(`Found layers, checking provider type`)

      if (this.#provider.name.toLowerCase() === "aws") {
        let layerDir = this.#dockerOptions.layersDir
        if (!layerDir) {
          layerDir = join(this.#servicePath, ".serverless-offline", "layers")
        }

        layerDir = join(layerDir, this.#getLayersSha256())

        if (await pathExists(layerDir)) {
          log.verbose(
            `Layers already exist for this function. Skipping download.`,
          )
        } else {
          log.verbose(`Storing layers at ${layerDir}`)

          // Only initialise if we have layers, we're using AWS, and they don't already exist
          this.#lambdaClient = new LambdaClient({
            apiVersion: "2015-03-31",
            region: this.#provider.region,
          })

          log.verbose(`Getting layers`)

          await Promise.all(
            this.#layers.map((layerArn) =>
              this.#downloadLayer(layerArn, layerDir),
            ),
          )
        }

        if (
          this.#dockerOptions.hostServicePath &&
          layerDir.startsWith(this.#servicePath)
        ) {
          layerDir = layerDir.replace(
            this.#servicePath,
            this.#dockerOptions.hostServicePath,
          )
        }
        dockerArgs.push("-v", `${layerDir}:/var/runtime:ro,delegated`)
      } else {
        log.warning(
          `Provider ${this.#provider.name} is Unsupported. Layers are only supported on aws.`,
        )
      }
    } else {
      log.debug("Looking for bootstrap file")
      const bootstrapDir = join(this.#servicePath, "bootstrap")
      if (await pathExists(bootstrapDir)) {
        log.debug(`Found bootstrap file at ${bootstrapDir}`)
        dockerArgs.push(
          "-v",
          `${bootstrapDir}:/var/runtime/bootstrap:ro,delegated`,
        )
      }
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

  async #downloadLayer(layerArn, layerDir) {
    const [, layerName] = layerArn.split(":layer:")
    const layerZipFile = `${layerDir}/${layerName}.zip`
    const layerProgress = progress.get(`layer-${layerName}`)

    log.verbose(`[${layerName}] ARN: ${layerArn}`)

    log.verbose(`[${layerName}] Getting Info`)
    layerProgress.notice(`Retrieving "${layerName}": Getting info`)

    const getLayerVersionCommand = new GetLayerVersionCommand({
      LayerName: layerArn,
    })

    try {
      let layer = null

      try {
        layer = await this.#lambdaClient.send(getLayerVersionCommand)
      } catch (err) {
        log.warning(`[${layerName}] ${err.code}: ${err.message}`)

        return
      }

      if (
        hasOwn(layer, "CompatibleRuntimes") &&
        !layer.CompatibleRuntimes.includes(this.#runtime)
      ) {
        log.warning(
          `[${layerName}] Layer is not compatible with ${this.#runtime} runtime`,
        )

        return
      }

      const { CodeSize: layerSize, Location: layerUrl } = layer.Content
      // const layerSha = layer.Content.CodeSha256

      await ensureDir(layerDir)

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

        return
      }

      const fileStream = createWriteStream(layerZipFile)

      await new Promise((resolve, reject) => {
        res.body.pipe(fileStream)
        res.body.on("error", (err) => {
          reject(err)
        })
        fileStream.on("finish", () => {
          resolve()
        })
      })

      log.verbose(`Retrieving "${layerName}": Unzipping to .layers directory`)
      layerProgress.notice(
        `Retrieving "${layerName}": Unzipping to .layers directory`,
      )

      const data = await readFile(layerZipFile)
      const zip = await jszip.loadAsync(data)

      await Promise.all(
        entries(zip.files).map(async ([filename, jsZipObj]) => {
          const fileData = await jsZipObj.async("nodebuffer")
          if (filename.endsWith(sep)) {
            return undefined
          }
          await ensureDir(join(layerDir, dirname(filename)))
          return writeFile(join(layerDir, filename), fileData, {
            mode: zip.files[filename].unixPermissions,
          })
        }),
      )

      log.verbose(`[${layerName}] Removing zip file`)

      await unlink(layerZipFile)
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

  #getLayersSha256() {
    return createHash("sha256").update(stringify(this.#layers)).digest("hex")
  }

  get isRunning() {
    return this.#containerId !== null && this.#port !== null
  }
}
