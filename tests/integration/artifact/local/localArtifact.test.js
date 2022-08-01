import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BASE_URL } from '../../../config.js'
import {
  compressArtifact,
  setup,
  teardown,
} from '../../../_testHelpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('Local artifact tests', function desc() {
  beforeEach(async () => {
    await Promise.all([
      compressArtifact(__dirname, './artifacts/hello1.zip', [
        './src/handler1.js',
        './src/package.json',
      ]),
      compressArtifact(__dirname, './artifacts/hello2.zip', [
        './src/handler2.js',
        './src/package.json',
      ]),
    ])

    await setup({
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
      const url = new URL(path, BASE_URL)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, expected)
    })
  })
})
