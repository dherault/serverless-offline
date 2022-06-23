'use strict'

const { env } = require('node:process')

exports.mochaHooks = {
  async beforeAll() {
    // env.RUN_TEST_AGAINST_AWS = env.AWS_ENDPOINT != null
    env.TEST_BASE_URL = env.AWS_ENDPOINT || 'http://localhost:3000'

    // install global fetch
    // TODO remove `node-fetch` module and use global built-in with node.js v18+ support
    if (globalThis.fetch === undefined) {
      const { default: fetch, Headers } = await import('node-fetch')
      globalThis.fetch = fetch
      globalThis.Headers = Headers
    }
  },
}
