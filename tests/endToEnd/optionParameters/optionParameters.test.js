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

describe('noPrependStageInUrl option', function desc() {
  this.timeout(30000)

  beforeEach(() =>
    setup({
      args: ['--noPrependStageInUrl'],
      servicePath: resolve(__dirname, 'src'),
    }),
  )

  afterEach(() => teardown())

  describe('when --noPrependStageInUrl is used, and the stage isnt in the url', () => {
    it('it should return a payload', async () => {
      const url = joinUrl(env.TEST_BASE_URL, '/hello')
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, { foo: 'bar' })
    })
  })

  describe('when --noPrependStageInUrl is used, and the stage isnt in the url', () => {
    it('noPrependStageInUrl 2', async () => {
      const url = joinUrl(env.TEST_BASE_URL, '/dev/hello')
      const response = await fetch(url)
      const json = await response.json()

      assert.equal(json.statusCode, 404)
    })
  })
})

describe('prefix option', function desc() {
  this.timeout(30000)

  beforeEach(() =>
    setup({
      args: ['--prefix', 'someprefix'],
      servicePath: resolve(__dirname, 'src'),
    }),
  )

  afterEach(() => teardown())

  describe('when the --prefix option is used', () => {
    it('the prefixed path should return a payload', async () => {
      const url = joinUrl(env.TEST_BASE_URL, '/someprefix/dev/hello')
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, { foo: 'bar' })
    })
  })
})
