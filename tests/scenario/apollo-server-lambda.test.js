import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { env } from 'node:process'
import { fileURLToPath } from 'node:url'
import fetch from 'node-fetch'
import { joinUrl, setup, teardown } from '../integration/_testHelpers/index.js'
import installNpmModules from '../installNpmModules.js'

const { stringify } = JSON

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('apollo server lambda graphql', function desc() {
  this.timeout(30000)

  beforeEach(async () => {
    await installNpmModules(resolve(__dirname, 'apollo-server-lambda'))

    await setup({
      servicePath: resolve(__dirname, 'apollo-server-lambda'),
    })
  })

  afterEach(() => teardown())

  it('apollo server lambda tests', async () => {
    const url = joinUrl(env.TEST_BASE_URL, '/dev/graphql')
    const response = await fetch(url, {
      body: stringify({
        query: `query test {
          hello
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
        hello: 'Hello graphql!',
      },
    }

    assert.deepEqual(json, expected)
  })
})
