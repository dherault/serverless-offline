import assert from 'node:assert'
import generateHapiPath from '../generateHapiPath.js'

const serverless = {
  service: {
    provider: {
      stage: 'dev',
    },
  },
}

describe('generateHapiPath', () => {
  it('should generate url starting with a slash', () => {
    const options = {}
    const result = generateHapiPath('users', options, serverless)
    assert.equal(result[0], '/')
  })

  it('should generate url with the stage prepended', () => {
    const options = {}
    const result = generateHapiPath('users', options, serverless)
    assert.equal(result, '/dev/users')
  })

  describe('when a prefix option is set', () => {
    it('the url should add the prefix', () => {
      const options = { prefix: 'some-prefix' }
      const result = generateHapiPath('users', options, serverless)
      assert.equal(result, '/some-prefix/dev/users')
    })
  })

  describe('when the noPrependStageInUrl option is set', () => {
    it('the url should omit the stage', () => {
      const options = { noPrependStageInUrl: true }
      const result = generateHapiPath('users', options, serverless)
      assert.equal(result, '/users')
    })
  })

  it('the stage from options should override stage from serverless config', () => {
    const options = { stage: 'prod' }
    const result = generateHapiPath('users', options, serverless)
    assert.equal(result, '/prod/users')
  })
})
