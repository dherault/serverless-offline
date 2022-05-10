'use strict'

// eslint-disable-next-line import/no-extraneous-dependencies
require('@babel/register')

module.exports = {
  runner: 'jest-light-runner',
  // Ignore 'tests' directory as it contains all the integration tests
  modulePathIgnorePatterns: ['src/lambda/__tests__/fixtures/', 'tests/'],
}
