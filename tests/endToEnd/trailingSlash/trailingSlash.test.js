import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BASE_URL } from '../../config.js'
import { setup, teardown } from '../../integration/_testHelpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('noStripTrailingSlashInUrl option', function desc() {
  beforeEach(() =>
    setup({
      args: ['--noStripTrailingSlashInUrl'],
      servicePath: resolve(__dirname, 'src'),
    }),
  )

  afterEach(() => teardown())

  describe('when --noStripTrailingSlashInUrl is used, and request is made ending with slash', () => {
    it('it should not be removed', async () => {
      const url = new URL('/dev/echo/something/', BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, {
        path: '/echo/something/',
        resource: '/echo/{any*}',
      })
    })
  })

  describe('when --noStripTrailingSlashInUrl is used, events with and without slash can co-exist', () => {
    it('it should not be removed', async () => {
      let url = new URL('/dev/echo/test', BASE_URL)
      let response = await fetch(url)
      let json = await response.json()

      assert.deepEqual(json, {
        path: '/echo/test',
        resource: '/echo/test',
      })

      url = new URL('/dev/echo/test/', BASE_URL)
      response = await fetch(url)
      json = await response.json()

      assert.deepEqual(json, {
        path: '/echo/test/',
        resource: '/echo/test/',
      })
    })
  })
})
