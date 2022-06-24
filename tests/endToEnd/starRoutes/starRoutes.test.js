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

describe('star routes', function desc() {
  this.timeout(30000)

  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname, 'src'),
    }),
  )

  afterEach(() => teardown())

  describe('when a star route is used (and has no path property)', () => {
    it('it should return a payload', async () => {
      const url = joinUrl(env.TEST_BASE_URL, '/dev')
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, { foo: 'bar' })
    })
  })
})
