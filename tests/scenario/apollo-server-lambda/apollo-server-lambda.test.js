import assert from 'node:assert'
import { resolve } from 'node:path'
import { env } from 'node:process'
import fetch from 'node-fetch'
import {
  joinUrl,
  setup,
  teardown,
} from '../../integration/_testHelpers/index.js'
import installNpmModules from '../../installNpmModules.js'

describe('apollo server lambda graphql', function desc() {
  this.timeout(30000)

  beforeEach(async () => {
    await installNpmModules(resolve(__dirname))

    await setup({
      servicePath: resolve(__dirname),
    })
  })

  afterEach(() => teardown())

  it('apollo server lambda tests', async () => {
    const { default: ApolloClient } = await import('apollo-boost')
    const { default: gql } = await import('graphql-tag')

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
