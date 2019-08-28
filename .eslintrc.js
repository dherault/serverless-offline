'use strict'

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
    // we use underscores to indicate private fields in classes
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

    // TODO FIXME turn off temporary, to make eslint pass
    'class-methods-use-this': 'off',
    'no-console': 'off',
    'no-restricted-syntax': 'off',
  },
}
