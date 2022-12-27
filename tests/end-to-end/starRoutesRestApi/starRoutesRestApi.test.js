import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BASE_URL } from '../../config.js'
import { setup, teardown } from '../../_testHelpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('star routes', function desc() {
  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname, 'src'),
    }),
  )

  afterEach(() => teardown())

  describe('when a catch all route is used in a rest api', () => {
    it('it should return a payload', async () => {
      const url = new URL('/dev/hello', BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, { path: '/hello', resource: '/{proxy+}' })
    })
  })
})
