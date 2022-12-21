import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setup, teardown } from '../../../../_testHelpers/index.js'
import { BASE_URL } from '../../../../config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('generated api key tests', function desc() {
  it('...', async () => {
    let stdoutData

    const generatedApiKey = new Promise((res) => {
      stdoutData = (data) => {
        const strData = String(data)

        if (strData.includes("Key with token: '")) {
          const fromIndex = strData.indexOf("'") + 1
          const toIndex = strData.indexOf("'", fromIndex)

          res(strData.substring(fromIndex, toIndex))
        }
      }
    })

    await setup({
      servicePath: resolve(__dirname),
      stdoutData,
    })

    const url = new URL('/dev/foo', BASE_URL)

    const response = await fetch(url, {
      headers: {
        'x-api-key': await generatedApiKey,
      },
    })
    assert.equal(response.status, 200)

    const json = await response.json()
    assert.deepEqual(json, {
      foo: 'bar',
    })

    await teardown()
  })
})
