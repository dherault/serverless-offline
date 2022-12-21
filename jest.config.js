'use strict'

const { env } = require('process')

module.exports = {
  bail: true,
  globals: {
    RUN_TEST_AGAINST_AWS: env.AWS_ENDPOINT != null,
    TEST_BASE_URL: env.AWS_ENDPOINT || 'http://localhost:3000',
  },
  modulePathIgnorePatterns: ['src/lambda/__tests__/fixtures/'],
  ...(!env.SKIP_SETUP && {
    globalSetup: './tests/_setupTeardown/npmInstall.js',
  }),
}
