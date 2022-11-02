import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setup, teardown } from '../../_testHelpers/index.js'
import { BASE_URL } from '../../config.js'
import installNpmModules from '../../installNpmModules.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('Lambda.invokeAsync aws-sdk v3 tests', function desc() {
  before(async () => {
    await installNpmModules(resolve(__dirname, 'src'))
  })

  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  //
  ;[
    {
      description: '...',
      expected: {
        Payload: {},
        StatusCode: 202,
      },
      path: '/dev/invoke-async',
      status: 200,
    },
  ].forEach(({ description, expected, path, status }) => {
    it(description, async () => {
      const url = new URL(path, BASE_URL)

      const response = await fetch(url)
      assert.equal(response.status, status)

      const json = await response.json()
      assert.deepEqual(json, expected)
    })
  })
})
