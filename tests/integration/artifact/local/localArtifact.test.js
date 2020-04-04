import { resolve } from 'path'
import fetch from 'node-fetch'
import {
  compressArtifact,
  joinUrl,
  setup,
  teardown,
} from '../../_testHelpers/index.js'

jest.setTimeout(60000)

describe('Local artifact tests', () => {
  // init
  beforeAll(async () => {
    await compressArtifact(__dirname, './artifacts/hello1.zip', [
      './handler1.js',
    ])
    await compressArtifact(__dirname, './artifacts/hello2.zip', [
      './handler2.js',
    ])
    return setup({
      servicePath: resolve(__dirname),
    })
  })

  // cleanup
  afterAll(() => teardown())

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
    test(description, async () => {
      const url = joinUrl(TEST_BASE_URL, path)
      const response = await fetch(url)
      const json = await response.json()

      expect(json).toEqual(expected)
    })
  })
})
