// tests based on:
// https://dev.to/piczmar_0/serverless-authorizers---custom-rest-authorizer-16

import assert from 'node:assert'
import { join } from 'desm'
import { setup, teardown } from '../../_testHelpers/index.js'
import { BASE_URL } from '../../config.js'

describe('RestApi Authorizers Tests', function desc() {
  beforeEach(() =>
    setup({
      servicePath: join(import.meta.url),
    }),
  )

  afterEach(() => teardown())

  it('should handle configuration with a single header in method.request format', async () => {
    const url = new URL('/dev/single-header-method', BASE_URL)
    const options = {
      headers: {
        Authorization: 'Bearer abc123',
        'Content-Type': 'application/json',
      },
      method: 'get',
    }

    const response = await fetch(url, options)

    assert.equal(response.status, 200)
  })

  it('should handle configuration with a multi header in method.request format', async () => {
    const url = new URL('/dev/multi-header-method', BASE_URL)
    const options = {
      headers: {
        Authorization: 'Bearer abc123',
        'Content-Type': 'application/json',
        UserId: 'xxx',
      },
      method: 'get',
    }

    const response = await fetch(url, options)

    assert.equal(response.status, 200)
  })

  it('should handle configuration with a single header in $request format', async () => {
    const url = new URL('/dev/single-header-dollar', BASE_URL)
    const options = {
      headers: {
        Authorization: 'Bearer abc123',
        'Content-Type': 'application/json',
      },
      method: 'get',
    }

    const response = await fetch(url, options)

    assert.equal(response.status, 200)
  })

  it('should handle configuration with a multi header in $request format', async () => {
    const url = new URL('/dev/multi-header-dollar', BASE_URL)
    const options = {
      headers: {
        Authorization: 'Bearer abc123',
        'Content-Type': 'application/json',
        UserId: 'xxx',
      },
      method: 'get',
    }

    const response = await fetch(url, options)

    assert.equal(response.status, 200)
  })
})
