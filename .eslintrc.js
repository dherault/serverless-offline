'use strict'

const { platform } = require('os')

const { env } = process

module.exports = {
  extends: [
    'eslint:recommended',
    'eslint-config-airbnb-base',
    'plugin:prettier/recommended',
  ],

  env: {
    jest: true,
  },

  globals: {
    RUN_TEST_AGAINST_AWS: true,
    TEST_BASE_URL: true,
  },

  parserOptions: {
    sourceType: 'script',
  },

  rules: {
    // overwrite airbnb-base options
    'no-underscore-dangle': 'off',
    // import buffer explicitly
    'no-restricted-globals': [
      'error',
      {
        name: 'Buffer',
        message: "Import 'Buffer' from 'buffer' module instead",
      },
    ],
    // until we switch to ES6 modules (which use 'strict mode' implicitly)
    strict: ['error', 'global'],

    // TODO FIXME workaround for git + prettier line ending issue on Travis for Windows OS:
    ...(env.TRAVIS &&
      platform() === 'win32' && {
        'prettier/prettier': ['error', { endOfLine: 'auto' }],
      }),

    // TODO FIXME turn off temporary, to make eslint pass
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'no-console': 'off',
    'no-restricted-syntax': 'off',
    'no-shadow': 'off',
  },
}
