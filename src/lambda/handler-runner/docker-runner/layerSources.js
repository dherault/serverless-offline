/* eslint-disable no-await-in-loop */
import { createHash } from "node:crypto"
import {
  chmod,
  copyFile,
  lstat,
  mkdir,
  readdir,
  readFile,
  readlink,
  rm,
  stat,
  symlink,
  writeFile,
} from "node:fs/promises"
import { dirname, join, relative, resolve } from "node:path"
import jszip from "jszip"
import layerFileMode from "./layerFileMode.js"

const { entries, hasOwn } = Object

export function resolveLocalLayerPath(localLayers, layerArn, serviceRoot) {
  if (!localLayers || !hasOwn(localLayers, layerArn)) {
    return null
  }

  const configuredPath = localLayers[layerArn]

  if (typeof configuredPath !== "string" || configuredPath === "") {
    throw new TypeError(
      `The local layer source for ${layerArn} must be a non-empty path`,
    )
  }

  return resolve(serviceRoot, configuredPath)
}

export async function extractLayerZip(zipData, layerDir) {
  const zip = await jszip.loadAsync(zipData)

  await Promise.all(
    entries(zip.files).map(async ([filename, jsZipObject]) => {
      if (jsZipObject.dir) {
        return undefined
      }

      const fileData = await jsZipObject.async("nodebuffer")
      const outputPath = join(layerDir, filename)
      const mode = layerFileMode(filename, jsZipObject.unixPermissions)

      await mkdir(dirname(outputPath), { recursive: true })
      await writeFile(outputPath, fileData, { mode })
      return chmod(outputPath, mode)
    }),
  )
}

async function copyLocalLayerDirectory(sourceDir, layerDir, sourceRoot) {
  await mkdir(layerDir, { recursive: true })

  const directoryEntries = await readdir(sourceDir, { withFileTypes: true })

  // Walk large layers sequentially to avoid exhausting file descriptors.
  for (const directoryEntry of directoryEntries) {
    const sourcePath = join(sourceDir, directoryEntry.name)
    const outputPath = join(layerDir, directoryEntry.name)

    if (directoryEntry.isDirectory()) {
      await copyLocalLayerDirectory(sourcePath, outputPath, sourceRoot)
    } else if (directoryEntry.isFile() || directoryEntry.isSymbolicLink()) {
      // an earlier layer may have put a file, a symlink or a directory here,
      // writing through a symlink would escape the layer directory
      await rm(outputPath, { force: true, recursive: true })

      if (directoryEntry.isSymbolicLink()) {
        // layers ship symlinks, node_modules/.bin for one, and AWS keeps them
        await symlink(await readlink(sourcePath), outputPath)
      } else {
        const sourceStats = await stat(sourcePath)

        await copyFile(sourcePath, outputPath)
        await chmod(
          outputPath,
          layerFileMode(relative(sourceRoot, sourcePath), sourceStats.mode),
        )
      }
    } else {
      throw new TypeError(
        `Local layer directories only support files, directories and symbolic links: ${sourcePath}`,
      )
    }
  }
}

export async function extractLocalLayer(sourcePath, layerDir) {
  const sourceStats = await stat(sourcePath)

  if (sourceStats.isDirectory()) {
    await copyLocalLayerDirectory(sourcePath, layerDir, sourcePath)
    return
  }

  if (sourceStats.isFile()) {
    await extractLayerZip(await readFile(sourcePath), layerDir)
    return
  }

  throw new TypeError(
    `Local layer sources must be ZIP files or directories: ${sourcePath}`,
  )
}

// the configured source is followed, the entries below it are hashed the way
// they are copied: a symlink by its target, not by what the target contains
async function hashLocalLayerEntry(sourcePath, sourceRoot, follow = false) {
  const hash = createHash("sha256")
  const sourceStats = follow ? await stat(sourcePath) : await lstat(sourcePath)
  const sourceName = relative(sourceRoot, sourcePath)

  hash.update(sourceName)
  hash.update(String(sourceStats.mode))

  if (sourceStats.isDirectory()) {
    hash.update("directory")

    const filenames = await readdir(sourcePath)
    filenames.sort()

    // Keep the sorted traversal bounded for layers with large dependency trees.
    for (const filename of filenames) {
      hash.update(
        await hashLocalLayerEntry(join(sourcePath, filename), sourceRoot),
      )
    }
  } else if (sourceStats.isFile()) {
    hash.update("file")
    hash.update(await readFile(sourcePath))
  } else if (sourceStats.isSymbolicLink()) {
    hash.update("symlink")
    hash.update(await readlink(sourcePath))
  } else {
    throw new TypeError(
      `Local layer sources must contain only files, directories and symbolic links: ${sourcePath}`,
    )
  }

  return hash.digest("hex")
}

export async function hashLocalLayer(sourcePath) {
  return hashLocalLayerEntry(sourcePath, dirname(sourcePath), true)
}
