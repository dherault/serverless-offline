import { platform } from 'os'
import { resolve } from 'path'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../../_testHelpers/index.js'

jest.setTimeout(60000)

// skipping 'Python 3' tests on Windows for now.
// Could not find 'Python 3' executable, skipping 'Python' tests.
const _describe =
  process.env.PYTHON3_DETECTED && platform() !== 'win32'
    ? describe
    : describe.skip

_describe('Python 3 tests', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  // cleanup
  afterAll(() => teardown())

  //
  ;[
    {
      description: 'should work with python 3',
      expected: {
        message: 'Hello Python 3!',
      },
      path: '/hello',
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
