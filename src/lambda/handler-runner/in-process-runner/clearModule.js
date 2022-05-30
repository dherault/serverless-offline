import { readdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'

const { keys } = Object

const require = createRequire(import.meta.url)

export default async function clearModule(fP, opts) {
  const options = opts ?? {}
  let filePath = fP

  if (!require.cache[filePath]) {
    const dirName = dirname(filePath)
    const dir = await readdir(dirName)

    for (const fn of dir) {
      const fullPath = resolve(dirName, fn)
      if (
        fullPath.substring(0, filePath.length + 1) === `${filePath}.` &&
        require.cache[fullPath]
      ) {
        filePath = fullPath
        break
      }
    }
  }

  if (require.cache[filePath]) {
    // Remove file from parent cache
    if (require.cache[filePath].parent) {
      let i = require.cache[filePath].parent.children.length

      if (i) {
        do {
          i -= 1
          if (require.cache[filePath].parent.children[i].id === filePath) {
            require.cache[filePath].parent.children.splice(i, 1)
          }
        } while (i)
      }
    }

    const cld = require.cache[filePath].children
    delete require.cache[filePath]

    for (const c of cld) {
      // Unload any non node_modules and non-binary children
      if (
        !c.filename.match(/\/node_modules\//i) &&
        !c.filename.match(/\.node$/i)
      ) {
        // eslint-disable-next-line no-await-in-loop
        await clearModule(c.id, { ...options, cleanup: false })
      }
    }

    if (opts.cleanup) {
      // Cleanup any node_modules that are orphans
      let cleanup = false

      do {
        cleanup = false
        for (const fn of keys(require.cache)) {
          if (
            require.cache[fn] &&
            require.cache[fn].id !== '.' &&
            require.cache[fn].parent &&
            require.cache[fn].parent.id !== '.' &&
            !require.cache[require.cache[fn].parent.id] &&
            !fn.match(/\/node_modules\//i) &&
            !fn.match(/\.node$/i)
          ) {
            delete require.cache[fn]
            cleanup = true
          }
        }
      } while (cleanup)
    }
  }
}
