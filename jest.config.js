'use strict'

const { AWS_ENDPOINT } = process.env

module.exports = {
  globals: {
    TEST_BASE_URL: AWS_ENDPOINT || 'http://localhost:3000',
    RUN_TEST_AGAINST_AWS: AWS_ENDPOINT != null,
  },

  modulePathIgnorePatterns: [
    '__tests__/integration/_testHelpers/',
    '__tests__/integration/handler/handlerPayload.js',
    '__tests__/integration/uncategorized/uncategorized.js',
    '__tests__/manual/',
    '__tests__/old-unit/fixtures/handler.js',
    '__tests__/old-unit/support/',
    'src/__tests__/fixtures/lambdaFunction.fixture.js',
  ],
  setupFiles: ['./src/polyfills.js'],
}
