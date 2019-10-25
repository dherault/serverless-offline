import { resolve } from 'path'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../_testHelpers/index.js'

jest.setTimeout(30000)

describe('handler payload tests', () => {
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
      description: 'when handler is context.done',
      expected: 'foo',
      path: '/context-done-handler',
      status: 200,
    },

    {
      description: 'when handler is context.done which is deferred',
      expected: 'foo',
      path: '/context-done-handler-deferred',
      status: 200,
    },

    {
      description: 'when handler is context.succeed',
      expected: 'foo',
      path: '/context-succeed-handler',
      status: 200,
    },

    {
      description: 'when handler is context.succeed which is deferred',
      expected: 'foo',
      path: '/context-succeed-handler-deferred',
      status: 200,
    },

    {
      description: 'when handler is a callback',
      expected: 'foo',
      path: '/callback-handler',
      status: 200,
    },
    {
      description: 'when handler is a callback which is deferred',
      expected: 'foo',
      path: '/callback-handler-deferred',
      status: 200,
    },

    {
      description: 'when handler returns a promise',
      expected: 'foo',
      path: '/promise-handler',
      status: 200,
    },

    {
      description: 'when handler a promise which is deferred',
      expected: 'foo',
      path: '/promise-handler-deferred',
      status: 200,
    },

    {
      description: 'when handler is an async function',
      expected: 'foo',
      path: '/async-function-handler',
      status: 200,
    },

    // NOTE: mix and matching of callbacks and promises is not recommended,
    // nonetheless, we test some of the behaviour to match AWS execution precedence
    {
      description:
        'when handler returns a callback but defines a callback parameter',
      expected: 'Hello Promise!',
      path: '/promise-with-defined-callback-handler',
      status: 200,
    },

    {
      description:
        'when handler throws an expection in promise should return 502',
      path: '/throw-exception-in-promise-handler',
      status: 502,
    },

    {
      description:
        'when handler throws an expection before calling callback should return 502',
      path: '/throw-exception-in-callback-handler',
      status: 502,
    },

    {
      description:
        'when handler does not return any answer in promise should return 502',
      path: '/no-answer-in-promise-handler',
      status: 502,
    },

    {
      description:
        'when handler returns bad answer in promise should return 200',
      path: '/bad-answer-in-promise-handler',
      status: 200,
    },

    {
      description:
        'when handler returns bad answer in callback should return 200',
      path: '/bad-answer-in-callback-handler',
      status: 200,
    },

    // TODO: reactivate!
    // {
    //   description: 'when handler calls context.succeed and context.done',
    //   expected: 'Hello Context.succeed!',
    //   path: '/context-succeed-with-context-done-handler',
    // },

    // TODO: reactivate!
    // {
    //   description: 'when handler calls callback and context.done',
    //   expected: 'Hello Callback!',
    //   path: '/callback-with-context-done-handler',
    // },

    // TODO: reactivate!
    // {
    //   description: 'when handler calls callback and returns Promise',
    //   expected: 'Hello Callback!',
    //   path: '/callback-with-promise-handler',
    // },

    // TODO: reactivate!
    // {
    //   description: 'when handler calls callback inside returned Promise',
    //   expected: 'Hello Callback!',
    //   path: '/callback-inside-promise-handler',
    // },
  ].forEach(({ description, expected, path, status }) => {
    test(description, async () => {
      const url = joinUrl(TEST_BASE_URL, path)

      const response = await fetch(url)
      expect(response.status).toEqual(status)

      if (expected) {
        const json = await response.json()
        expect(json).toEqual(expected)
      }
    })
  })
})
