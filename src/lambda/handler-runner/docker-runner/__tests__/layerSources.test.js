/* eslint-disable no-bitwise, unicorn/numeric-separators-style */
import assert from "node:assert"
import {
  chmod,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import JSZip from "jszip"
import {
  extractLocalLayer,
  hashLocalLayer,
  resolveLocalLayerPath,
} from "../layerSources.js"

describe("local layer sources", () => {
  let temporaryDirectory

  beforeEach(async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), "local-layers-"))
  })

  afterEach(() => rm(temporaryDirectory, { force: true, recursive: true }))

  it("should resolve configured sources relative to the service", () => {
    const layerArn =
      "arn:aws:lambda:us-east-1:123456789012:layer:custom-runtime:1"

    assert.equal(
      resolveLocalLayerPath(
        { [layerArn]: "layers/runtime.zip" },
        layerArn,
        temporaryDirectory,
      ),
      join(temporaryDirectory, "layers/runtime.zip"),
    )
    assert.equal(resolveLocalLayerPath({}, layerArn, temporaryDirectory), null)
  })

  it("should reject an invalid configured source", () => {
    const layerArn =
      "arn:aws:lambda:us-east-1:123456789012:layer:custom-runtime:1"

    assert.throws(
      () =>
        resolveLocalLayerPath(
          { [layerArn]: null },
          layerArn,
          temporaryDirectory,
        ),
      /must be a non-empty path/,
    )
  })

  it("should extract a local ZIP and restore bootstrap permissions", async () => {
    const zip = new JSZip()
    const zipPath = join(temporaryDirectory, "runtime.zip")
    const layerDir = join(temporaryDirectory, "extracted")

    zip.file("bootstrap", "#!/bin/sh", { unixPermissions: 0o100644 })
    zip.file("bin/tool", "from zip", { unixPermissions: 0o100755 })
    await writeFile(
      zipPath,
      await zip.generateAsync({ platform: "UNIX", type: "nodebuffer" }),
    )

    await extractLocalLayer(zipPath, layerDir)

    assert.equal(await readFile(join(layerDir, "bin/tool"), "utf8"), "from zip")
    assert.equal((await stat(join(layerDir, "bootstrap"))).mode & 0o777, 0o755)
  })

  it("should merge local directories in extraction order", async () => {
    const firstLayer = join(temporaryDirectory, "first")
    const secondLayer = join(temporaryDirectory, "second")
    const layerDir = join(temporaryDirectory, "extracted")

    await mkdir(join(firstLayer, "bin"), { recursive: true })
    await mkdir(join(secondLayer, "bin"), { recursive: true })
    await writeFile(join(firstLayer, "bin/tool"), "first")
    await writeFile(join(secondLayer, "bin/tool"), "second")
    await writeFile(join(secondLayer, "bootstrap"), "#!/bin/sh")
    await chmod(join(secondLayer, "bootstrap"), 0o644)

    await extractLocalLayer(firstLayer, layerDir)
    await extractLocalLayer(secondLayer, layerDir)

    assert.equal(await readFile(join(layerDir, "bin/tool"), "utf8"), "second")
    assert.equal((await stat(join(layerDir, "bootstrap"))).mode & 0o777, 0o755)
  })

  it("should change the cache hash when local content changes", async () => {
    const layerDir = join(temporaryDirectory, "layer")
    const layerFile = join(layerDir, "bin/tool")

    await mkdir(join(layerDir, "bin"), { recursive: true })
    await writeFile(layerFile, "first")
    const firstHash = await hashLocalLayer(layerDir)

    await writeFile(layerFile, "second")

    assert.notEqual(await hashLocalLayer(layerDir), firstHash)
  })
})
