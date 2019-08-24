'use strict'

const { AWS_ENDPOINT } = process.env

module.exports = {
  globals: {
    RUN_TEST_AGAINST_AWS: AWS_ENDPOINT != null,
    TEST_BASE_URL: AWS_ENDPOINT || 'http://localhost:3000',
  },
  globalSetup: './__tests__/_setupTeardown/npmInstall.js',
  modulePathIgnorePatterns: [
    '__tests__/_setupTeardown/',
    '__tests__/dev/',
    '__tests__/integration/_testHelpers/',
    '__tests__/integration/handler/handlerPayload.js',
    '__tests__/integration/uncategorized/uncategorized.js',
    '__tests__/manual/',
    '__tests__/old-unit/fixtures/',
    '__tests__/old-unit/support/',
    '__tests__/scenario/.eslintrc.js',
    '__tests__/scenario/apollo-server-lambda/src/',
    'src/__tests__/fixtures/',
  ],
  setupFiles: ['./src/polyfills.js'],
}
