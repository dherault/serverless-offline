import assert from 'node:assert'
import satisfiesVersionRange from '../satisfiesVersionRange.js'

describe('satisfiesVersionRange', () => {
  const tests = [
    {
      description: 'same as minimum',
      expected: true,
      range: '>=1.38',
      version: '1.38.0',
    },
    {
      description: 'greather than minimum',
      expected: true,
      range: '>=1.38',
      version: '1.40.0',
    },
    {
      description: 'less than minimum',
      expected: false,
      range: '>=1.38',
      version: '1.37.11',
    },
  ]

  tests.forEach(({ description, expected, range, version }) => {
    it(description, () => {
      const result = satisfiesVersionRange(version, range)
      assert.strictEqual(result, expected)
    })
  })
})

describe('should throw when invalid parameters are passed', () => {
  const tests = [
    {
      description: 'invalid version',
      message: 'Not a valid semver range: a.b.c',
      range: '>=1.40',
      version: 'a.b.c',
    },
    {
      description: 'invalid range',
      message: 'Not a valid semver version: a.b.c',
      range: 'a.b.c',
      version: '1.40.0',
    },
  ]

  tests.forEach(({ description, message, range, version }) => {
    it(description, () => {
      assert.throws(() => satisfiesVersionRange(version, range), message)
    })
  })
})
