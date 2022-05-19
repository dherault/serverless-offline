import fetch from 'node-fetch'
import { resolve } from 'node:path'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

jest.setTimeout(30000)

describe('custom authentication serverless-offline variable tests', () => {
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
      description:
        'should return custom payload from injected authentication provider',
      path: '/echo',
      status: 200,
    },
  ].forEach(({ description, path, status }) => {
    test(description, async () => {
      const url = joinUrl(TEST_BASE_URL, path)

      const response = await fetch(url)
      expect(response.status).toEqual(status)

      const json = await response.json()
      expect(json.event.requestContext.authorizer.expected).toEqual('it works')
    })
  })
})
