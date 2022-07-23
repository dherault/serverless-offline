import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BASE_URL } from '../../config.js'
import { setup, teardown } from '../../integration/_testHelpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('noPrependStageInUrl option', function desc() {
  beforeEach(() =>
    setup({
      args: ['--noPrependStageInUrl'],
      servicePath: resolve(__dirname, 'src'),
    }),
  )

  afterEach(() => teardown())

  describe('when --noPrependStageInUrl is used, and the stage isnt in the url', () => {
    it('it should return a payload', async () => {
      const url = new URL('/hello', BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, {
        foo: 'bar',
      })
    })
  })

  describe('when --noPrependStageInUrl is used, and the stage isnt in the url', () => {
    it('noPrependStageInUrl 2', async () => {
      const url = new URL('/dev/hello', BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.equal(json.statusCode, 404)
    })
  })
})

describe('prefix option', function desc() {
  beforeEach(() =>
    setup({
      args: ['--prefix', 'someprefix'],
      servicePath: resolve(__dirname, 'src'),
    }),
  )

  afterEach(() => teardown())

  describe('when the --prefix option is used', () => {
    it('the prefixed path should return a payload', async () => {
      const url = new URL('/someprefix/dev/hello', BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, {
        foo: 'bar',
      })
    })
  })
})
