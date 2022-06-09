import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import {
  joinUrl,
  setup,
  teardown,
} from '../../integration/_testHelpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('noStripTrailingSlashInUrl option', function desc() {
  this.timeout(30000)

  beforeEach(() =>
    setup({
      args: ['--noStripTrailingSlashInUrl'],
      servicePath: resolve(__dirname, 'src'),
    }),
  )

  afterEach(() => teardown())

  describe('when --noStripTrailingSlashInUrl is used, and request is made ending with slash', () => {
    it('it should not be removed', async () => {
      const url = joinUrl(env.TEST_BASE_URL, '/dev/echo/something/')
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
      let url = joinUrl(env.TEST_BASE_URL, '/dev/echo/test')
      let response = await fetch(url)
      let json = await response.json()

      assert.deepEqual(json, {
        path: '/echo/test',
        resource: '/echo/test',
      })

      url = joinUrl(env.TEST_BASE_URL, '/dev/echo/test/')
      response = await fetch(url)
      json = await response.json()

      assert.deepEqual(json, {
        path: '/echo/test/',
        resource: '/echo/test/',
      })
    })
  })
})
