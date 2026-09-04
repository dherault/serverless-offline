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
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path"
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

async function layerEntryStats(entryPath) {
  try {
    return await lstat(entryPath)
  } catch (err) {
    if (err.code === "ENOENT") {
      return null
    }

    throw err
  }
}

// the entries of a layer are relative to /opt, one climbing out of the layer
// directory would overwrite the files of the service
function layerEntryPath(layerDir, entryName) {
  const entryPath = join(layerDir, entryName)
  const relativePath = relative(layerDir, entryPath)

  if (
    relativePath === "" ||
    relativePath === ".." ||
    relativePath.startsWith(`..${sep}`) ||
    isAbsolute(relativePath)
  ) {
    throw new TypeError(
      `Layer entries have to stay inside the layer directory: ${entryName}`,
    )
  }

  return entryPath
}

// layers are extracted on top of each other, so a directory of this layer can
// land on a file or a symbolic link of an earlier one. mkdir follows a link to
// a directory, which would put the files below it outside of the layer.
async function makeLayerDirectory(directoryPath) {
  const entryStats = await layerEntryStats(directoryPath)

  if (entryStats && !entryStats.isDirectory()) {
    await rm(directoryPath, { force: true, recursive: true })
  }

  await mkdir(directoryPath, { recursive: true })
}

// every component below the layer directory has to be a real directory, a
// symbolic link anywhere along the way is enough to escape it
async function makeLayerDirectories(layerDir, directoryPath) {
  const segments = relative(layerDir, directoryPath).split(sep).filter(Boolean)

  let currentPath = layerDir

  for (const segment of segments) {
    currentPath = join(currentPath, segment)
    await makeLayerDirectory(currentPath)
  }
}

// writeFile follows a symbolic link left by an earlier layer and fails on a
// directory, replacing the entry keeps this layer's precedence
async function writeLayerFile(outputPath, fileData, mode) {
  await rm(outputPath, { force: true, recursive: true })
  await writeFile(outputPath, fileData, { mode })
  await chmod(outputPath, mode)
}

export async function extractLayerZip(zipData, layerDir) {
  const zip = await jszip.loadAsync(zipData)

  await makeLayerDirectory(layerDir)

  const files = entries(zip.files)
    .filter(([, jsZipObject]) => !jsZipObject.dir)
    .map(([filename, jsZipObject]) => ({
      filename,
      jsZipObject,
      outputPath: layerEntryPath(layerDir, filename),
    }))

  // The directories are prepared before any file is written: two files of the
  // same directory would otherwise race to replace what an earlier layer left
  // there, one of them removing what the other one has just written.
  const directories = new Set(
    files.map(({ outputPath }) => dirname(outputPath)),
  )

  for (const directoryPath of directories) {
    await makeLayerDirectories(layerDir, directoryPath)
  }

  await Promise.all(
    files.map(({ filename, jsZipObject, outputPath }) =>
      jsZipObject
        .async("nodebuffer")
        .then((fileData) =>
          writeLayerFile(
            outputPath,
            fileData,
            layerFileMode(filename, jsZipObject.unixPermissions),
          ),
        ),
    ),
  )
}

async function copyLocalLayerDirectory(sourceDir, layerDir, sourceRoot) {
  await makeLayerDirectory(layerDir)

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
