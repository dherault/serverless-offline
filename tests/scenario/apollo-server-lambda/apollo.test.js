import { resolve } from 'path'
import ApolloClient from 'apollo-boost'
import fetch from 'node-fetch'
import gql from 'graphql-tag'
import {
  joinUrl,
  setup,
  teardown,
} from '../../integration/_testHelpers/index.js'

jest.setTimeout(30000)

describe('apollo server lambda graphql', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
    }),
  )

  // cleanup
  afterAll(() => teardown())

  test('apollo server lambda tests', async () => {
    const url = joinUrl(TEST_BASE_URL, '/graphql')

    const apolloClient = new ApolloClient({
      fetch,
      uri: url.toString(),
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

    expect(data).toEqual(expected)
  })
})
