import assert from 'node:assert'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BASE_URL } from '../../../config.js'
import { setup, teardown } from '../../../integration/_testHelpers/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('run mode with worker threads and --localEnvironment flag', function desc() {
  beforeEach(() =>
    setup({
      env: {
        AWS_ACCESS_KEY_ID: 'SHOULD_BE_SHARED',
        AWS_FOOBAR: 'SHOULD_BE_SHARED',
        ENV_SHOULD_BE_SHARED: 'ENV_SHOULD_BE_SHARED',
      },
      servicePath: resolve(__dirname),
    }),
  )

  afterEach(() => teardown())

  it('should not share env', async () => {
    const url = new URL('/dev/foo', BASE_URL)

    const response = await fetch(url)
    assert.equal(response.status, 200)

    const { env } = await response.json()

    assert.equal(env.AWS_ACCESS_KEY_ID, 'SHOULD_BE_SHARED')
    assert.equal(env.AWS_FOOBAR, 'SHOULD_BE_SHARED')
    assert.equal(env.ENV_FUNCTIONS_FOO, 'ENV_FUNCTIONS_BAR')
    assert.equal(env.ENV_PROVIDER_FOO, 'ENV_PROVIDER_BAR')
    assert.equal(env.ENV_SHOULD_BE_SHARED, 'ENV_SHOULD_BE_SHARED')
    assert.equal(env.IS_OFFLINE, 'true')
  })
})
