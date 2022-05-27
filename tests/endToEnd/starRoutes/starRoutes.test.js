import assert from 'node:assert'
import { resolve } from 'node:path'
import { env } from 'node:process'
import fetch from 'node-fetch'
import {
  joinUrl,
  setup,
  teardown,
} from '../../integration/_testHelpers/index.js'

describe('star routes', function desc() {
  this.timeout(30000)

  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
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
