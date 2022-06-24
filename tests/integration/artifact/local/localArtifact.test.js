import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import {
  compressArtifact,
  joinUrl,
  setup,
  teardown,
} from '../../_testHelpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('Local artifact tests', function desc() {
  this.timeout(60000)

  beforeEach(async () => {
    await compressArtifact(__dirname, './artifacts/hello1.zip', [
      './src/handler1.js',
      './src/package.json',
    ])
    await compressArtifact(__dirname, './artifacts/hello2.zip', [
      './src/handler2.js',
      './src/package.json',
    ])
    return setup({
      servicePath: resolve(__dirname),
    })
  })

  afterEach(() => teardown())

  //
  ;[
    {
      description: 'should work with service artifact',
      expected: {
        message: 'handler1: Hello Node.js!',
      },
      path: '/dev/hello1',
    },
    {
      description: 'should work with function artifact',
      expected: {
        message: 'handler2: Hello Node.js!',
      },
      path: '/dev/hello2',
    },
  ].forEach(({ description, expected, path }) => {
    it(description, async () => {
      const url = joinUrl(env.TEST_BASE_URL, path)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, expected)
    })
  })
})
