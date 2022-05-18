import { resolve } from 'path'
import { env } from 'process'
import fetch from 'node-fetch'
import {
  joinUrl,
  setup,
  teardown,
} from '../../integration/_testHelpers/index.js'

jest.setTimeout(30000)

describe('environment variables', () => {
  const ENV_VAR_QUOTED = 'I am ENV_VAR_1'
  const ENV_VAR_UNQUOTED = 'I am ENV_VAR_2'
  const ENV_VAR_MAPPED = 'I am ENV_VAR_3'

  // init
  let json
  beforeAll(async () => {
    env.ENV_VAR_QUOTED = ENV_VAR_QUOTED
    env.ENV_VAR_UNQUOTED = ENV_VAR_UNQUOTED
    env.ENV_VAR_MAPPED_FROM_ANOTHER = ENV_VAR_MAPPED
    await setup({
      servicePath: resolve(__dirname),
    })
    const url = joinUrl(TEST_BASE_URL, '/dev/hello')
    const response = await fetch(url)
    json = await response.json()
  })

  // cleanup
  afterAll(async () => {
    env.ENV_VAR_QUOTED = undefined
    env.ENV_VAR_UNQUOTED = undefined
    env.ENV_VAR_MAPPED_FROM_ANOTHER = undefined
    await teardown()
  })

  test('it should handle a quoted environment variable', () => {
    expect(json).toMatchObject({
      ENV_VAR_QUOTED,
    })
  })

  test('it should handle an unquoted environment variable', () => {
    expect(json).toMatchObject({
      ENV_VAR_UNQUOTED,
    })
  })

  test('it should handle a mapped environment variable', () => {
    expect(json).toMatchObject({
      ENV_VAR_MAPPED,
    })
  })

  test('it should handle an undefined quoted environment variable', () => {
    expect(json).not.toHaveProperty('ENV_VAR_EMPTY_STRING', undefined)
  })

  test('it should handle an undefined unquoted environment variable', () => {
    expect(json).not.toHaveProperty('ENV_VAR_UNDEFINED', undefined)
  })
})
