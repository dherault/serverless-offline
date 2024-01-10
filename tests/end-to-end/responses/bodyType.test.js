import assert from 'node:assert'
import { join } from 'desm'
import { BASE_URL } from '../../config.js'
import { setup, teardown } from '../../_testHelpers/index.js'

describe('responses', function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url, 'src'),
    }),
  )

  afterEach(() => teardown())

  describe('When responses property is used without default key', () => {
    it('should return correct payload', async () => {
      const url = new URL('/dev/products', BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, {
        foo: 'bar',
      })
    })
  })
})
