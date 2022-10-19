import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setup, teardown } from '../../../_testHelpers/index.js'
import { BASE_URL } from '../../../config.js'
import installNpmModules from '../../../installNpmModules.js'

const { stringify } = JSON

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('apollo federation supergraph', function desc() {
  before(async () => {
    await installNpmModules(resolve(__dirname, 'app'))
  })

  beforeEach(async () => {
    await setup({
      servicePath: resolve(__dirname, 'app'),
    })
  })

  afterEach(() => teardown())

  it('apollo server lambda tests', async () => {
    const url = new URL('/dev/graphql', BASE_URL)

    const response = await fetch(url, {
      body: stringify({
        query: `query test {
          me {
            id
            username
          }
          
          allProducts {
            id
            dimensions {
              size
            }
            delivery {
              estimatedDelivery
            }
          }
        }`,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const json = await response.json()

    const expected = {
      data: {
        allProducts: [
          {
            delivery: {
              estimatedDelivery: '6/25/2021',
            },
            dimensions: {
              size: '1',
            },
            id: 'apollo-federation',
          },
          {
            delivery: {
              estimatedDelivery: '6/25/2021',
            },
            dimensions: {
              size: '1',
            },
            id: 'apollo-studio',
          },
        ],
        me: {
          id: '1',
          username: '@ava',
        },
      },
    }

    assert.deepEqual(json, expected)
  })
})
