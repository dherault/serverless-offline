'use strict'

const { AWS_ENDPOINT } = process.env

module.exports = {
  globals: {
    RUN_TEST_AGAINST_AWS: AWS_ENDPOINT != null,
    TEST_BASE_URL: AWS_ENDPOINT || 'http://localhost:3000',
  },
  globalSetup: './tests/_setupTeardown/npmInstall.js',
  modulePathIgnorePatterns: ['src/lambda/__tests__/fixtures/'],
  setupFiles: ['object.fromentries/auto.js'],
}
