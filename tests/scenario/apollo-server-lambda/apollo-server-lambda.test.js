import assert from 'node:assert'
import { resolve } from 'node:path'
import { env } from 'node:process'
import ApolloClient from 'apollo-boost'
import fetch from 'node-fetch'
import gql from 'graphql-tag'
import {
  joinUrl,
  setup,
  teardown,
} from '../../integration/_testHelpers/index.js'

// jest.setTimeout(30000)

describe('apollo server lambda graphql', function describe() {
  this.timeout(30000)

  beforeEach(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  it('apollo server lambda tests', async () => {
    const url = joinUrl(env.TEST_BASE_URL, '/dev/graphql')

    const apolloClient = new ApolloClient({
      fetch,
      uri: String(url),
    })

    const data = await apolloClient.query({
      query: gql`
        query test {
          hello
        }
      `,
    })

    const expected = {
      data: {
        hello: 'Hello graphql!',
      },
      loading: false,
      networkStatus: 7,
      stale: false,
    }

    assert.deepEqual(data, expected)
  })
})
