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
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  rules: {
    // require file extensions
    'import/extensions': ['error', 'always', { ignorePackages: true }],

    'no-restricted-exports': 'off',

    'no-restricted-globals': [
      'error',
      {
        message: "Import 'Buffer' from 'node:buffer' module instead",
        name: 'Buffer',
      },
      {
        message: "Import 'process' from 'node:process' module instead",
        name: 'process',
      },
    ],

    'sort-keys': 'error',

    // we turn this off here, for all commonjs modules (e.g. test fixtures etc.)
    strict: ['off'],

    // TODO FIXME turn off temporary, to make eslint pass
    'class-methods-use-this': 'off',
    'lines-between-class-members': 'off',
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': 'off',
  },
}
