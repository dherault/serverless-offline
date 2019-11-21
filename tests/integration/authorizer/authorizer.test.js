// tests based on:
// https://dev.to/piczmar_0/serverless-authorizers---custom-rest-authorizer-16

import { resolve } from 'path'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

jest.setTimeout(3000000) // TODO FIXME

// const { stringify } = JSON

describe('authorizer tests', () => {
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
      description: '...',
      expected: {
        status: 'authorized',
      },
      options: {
        headers: {
          Authorization: 'Bearer 4674cc54-bd05-11e7-abc4-cec278b6b50a',
        },
      },
      path: '/user1',
      status: 200,
    },

    {
      description: '...',
      expected: {
        status: 'authorized',
      },
      options: {
        headers: {
          Authorization: 'Bearer 4674cc54-bd05-11e7-abc4-cec278b6b50a',
        },
      },
      path: '/user2',
      status: 200,
    },
  ].forEach(({ description, expected, options, path, status }) => {
    test(description, async () => {
      const url = joinUrl(TEST_BASE_URL, path)

      const response = await fetch(url, options)
      expect(response.status).toEqual(status)

      const json = await response.json()
      expect(json).toEqual(expected)
    })
  })
})
