'use strict'

const { resolve } = require('path')
const { default: ApolloClient } = require('apollo-boost')
const gql = require('graphql-tag')
const {
  joinUrl,
  setup,
  teardown,
} = require('../../integration/_testHelpers/index.js')

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
        hello: 'Hello world!',
      },
      loading: false,
      networkStatus: 7,
      stale: false,
    }

    expect(data).toEqual(expected)
  })
})
