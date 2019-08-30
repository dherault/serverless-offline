import { resolve } from 'path'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../../_testHelpers/index.js'
import { detectPython2 } from '../../../../src/utils/index.js'

jest.setTimeout(60000)

describe.skip('Python 2 tests', () => {
  if (!detectPython2()) {
    it.only("Could not find 'Python 2' executable, skipping 'Python' tests.", () => {})
  }

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
      description: 'should work with python 2',
      expected: {
        message: 'Hello Python 2!',
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
