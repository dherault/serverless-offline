import generateHapiPath from '../generateHapiPath.js'

const serverless = {
  service: {
    provider: {
      stage: 'dev',
    },
  },
}

describe('generateHapiPath', () => {
  test('should generate url starting with a slash', () => {
    const options = {}
    const result = generateHapiPath('users', options, serverless)
    expect(result[0]).toEqual('/')
  })

  test('should generate url with the stage prepended', () => {
    const options = {}
    const result = generateHapiPath('users', options, serverless)
    expect(result).toEqual('/dev/users')
  })

  describe('when a prefix option is set', () => {
    test('the url should add the prefix', () => {
      const options = { prefix: 'some-prefix' }
      const result = generateHapiPath('users', options, serverless)
      expect(result).toEqual('/some-prefix/dev/users')
    })
  })

  describe('when the noPrependStageInUrl option is set', () => {
    test('the url should omit the stage', () => {
      const options = { noPrependStageInUrl: true }
      const result = generateHapiPath('users', options, serverless)
      expect(result).toEqual('/users')
    })
  })

  test('the stage from options should override stage from serverless config', () => {
    const options = { stage: 'prod' }
    const result = generateHapiPath('users', options, serverless)
    expect(result).toEqual('/prod/users')
  })
})
