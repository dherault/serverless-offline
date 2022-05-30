import { dirname, resolve } from 'node:path'
import archiver from 'archiver'
import fs from 'fs-extra'

export default async function compressArtifact(baseDir, dest, src = []) {
  const destPath = resolve(baseDir, dest)
  await fs.ensureDir(dirname(destPath))

  return new Promise((_resolve, reject) => {
    const output = fs.createWriteStream(destPath)
    const archive = archiver('zip', {
      zlib: { level: 9 },
    })

    output.on('open', async () => {
      archive.pipe(output)

      await Promise.all(
        src.map(async (filename) => {
          const filepath = resolve(baseDir, filename)
          const stats = await fs.stat(filepath)
          if (stats.isDirectory()) {
            archive.directory(filepath, filename)
            return
          }
          archive.file(filepath, { name: filename })
        }),
      )

      archive.finalize()
    })

    archive.on('error', (err) => reject(err))
    output.on('close', () => _resolve())
  })
}
