import { resolve } from 'node:path'
import fetch from 'node-fetch'
import {
  joinUrl,
  setup,
  teardown,
} from '../../integration/_testHelpers/index.js'

jest.setTimeout(30000)

describe('noStripTrailingSlashInUrl option', () => {
  // init
  beforeAll(() =>
    setup({
      servicePath: resolve(__dirname),
      args: ['--noStripTrailingSlashInUrl'],
    }),
  )

  // cleanup
  afterAll(() => teardown())

  describe('when --noStripTrailingSlashInUrl is used, and request is made ending with slash', () => {
    test('it should not be removed', async () => {
      const url = joinUrl(TEST_BASE_URL, '/dev/echo/something/')
      const response = await fetch(url)
      const json = await response.json()

      expect(json).toEqual({
        path: '/echo/something/',
        resource: '/echo/{any*}',
      })
    })
  })

  describe('when --noStripTrailingSlashInUrl is used, events with and without slash can co-exist', () => {
    test('it should not be removed', async () => {
      let url = joinUrl(TEST_BASE_URL, '/dev/echo/test')
      let response = await fetch(url)
      let json = await response.json()
      expect(json).toEqual({
        path: '/echo/test',
        resource: '/echo/test',
      })

      url = joinUrl(TEST_BASE_URL, '/dev/echo/test/')
      response = await fetch(url)
      json = await response.json()
      expect(json).toEqual({
        path: '/echo/test/',
        resource: '/echo/test/',
      })
    })
  })
})
