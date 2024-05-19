import { createWriteStream } from "node:fs"
import { stat } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import archiver from "archiver"
import { ensureDir } from "fs-extra"

export default async function compressArtifact(baseDir, dest, src) {
  const destPath = resolve(baseDir, dest)

  await ensureDir(dirname(destPath))

  return new Promise((res, rej) => {
    const output = createWriteStream(destPath)
    const archive = archiver("zip", {
      zlib: {
        level: 9,
      },
    })

    output.on("open", async () => {
      archive.pipe(output)

      await Promise.all(
        src.map(async (filename) => {
          const filepath = resolve(baseDir, filename)
          const stats = await stat(filepath)
          if (stats.isDirectory()) {
            archive.directory(filepath, filename)
            return
          }
          archive.file(filepath, { name: filename })
        }),
      )

      await archive.finalize()
    })

    archive.on("error", (err) => rej(err))
    output.on("close", () => res())
  })
}
