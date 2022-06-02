import assert from 'node:assert'
import authFunctionNameExtractor from '../../src/events/authFunctionNameExtractor.js'

const v3Utils = {
  log: {
    debug: () => {},
    error: () => {},
    info: () => {},
    notice: () => {},
    warning: () => {},
  },
  progress: () => {},
  writeText: () => {},
}

describe('authFunctionNameExtractor', () => {
  describe('supported auth method', () => {
    const supportedAuthTest = (authorizer, expectedAuthorizerName) => () => {
      const endpoint = { authorizer }
      const result = authFunctionNameExtractor(endpoint, v3Utils)

      assert.strictEqual(result.unsupportedAuth, undefined)
      assert.strictEqual(result.authorizerName, expectedAuthorizerName)
    }

    describe('authorizer is a string', () => {
      it(
        'is a string anAuthorizerName',
        supportedAuthTest('anAuthorizerName', 'anAuthorizerName'),
      )
    })

    describe('authorizer is an object', () => {
      it(
        'named anAuthorizerName',
        supportedAuthTest({ name: 'anAuthorizerName' }, 'anAuthorizerName'),
      )
    })
  })
})
