import { resolve } from 'path'
import fetch from 'node-fetch'
import { satisfies } from 'semver'
import { joinUrl, setup, teardown } from '../../_testHelpers/index.js'

jest.setTimeout(240000)

describe('Multiple docker containers', () => {
  if (!process.env.DOCKER_DETECTED) {
    test.only("Could not find 'Docker' executable, skipping 'Docker' tests.", () => {})
  } else {
    // init
    beforeAll(() =>
      setup({
        servicePath: resolve(__dirname),
      }),
    )

    // cleanup
    afterAll(() => teardown())
  }

  //
  ;[
    {
      description: 'should work with multiple mixed docker containers',
      expected1: {
        message: 'Hello Node.js!',
      },
      expected2: {
        message: 'Hello Node.js!',
      },
      expected3: {
        message: 'Hello Python!',
      },
      path1: '/hello1',
      path2: '/hello2',
      path3: '/hello3',
    },
  ].forEach(
    ({ description, expected1, expected2, expected3, path1, path2, path3 }) => {
      test(description, async () => {
        const url1 = joinUrl(TEST_BASE_URL, path1)
        const url2 = joinUrl(TEST_BASE_URL, path2)
        const url3 = joinUrl(TEST_BASE_URL, path3)

        const [response1, response2, response3] = await Promise.all([
          fetch(url1),
          fetch(url2),
          fetch(url3),
        ])

        const [json1, json2, json3] = await Promise.all([
          response1.json(),
          response2.json(),
          response3.json(),
        ])

        expect(json1.message).toEqual(expected1.message)
        expect(json2.message).toEqual(expected2.message)
        expect(json3.message).toEqual(expected3.message)

        expect(satisfies(json1.version, '12')).toEqual(true)
        expect(satisfies(json2.version, '10')).toEqual(true)
      })
    },
  )
})
