'use strict'

module.exports = {
  env: {
    es2022: true,
    mocha: true,
  },

  extends: [
    'eslint:recommended',
    'eslint-config-airbnb-base',
    'plugin:prettier/recommended',
    'plugin:unicorn/recommended',
  ],

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  rules: {
    // require file extensions
    'import/extensions': [
      'error',
      'always',
      {
        ignorePackages: true,
      },
    ],

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
    'import/no-unresolved': 'off', // eslint-plugin-import has problems with package exports
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': [
      'error',
      {
        allow: ['__dirname', '_rawDebug'],
      },
    ],
    // unicorn temp off
    'unicorn/catch-error-name': 'off',
    'unicorn/consistent-destructuring': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-await-expression-member': 'off',
    'unicorn/no-lonely-if': 'off',
    'unicorn/no-new-array': 'off',
    'unicorn/no-null': 'off',
    'unicorn/no-static-only-class': 'off',
    'unicorn/no-unreadable-array-destructuring': 'off',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/prefer-spread': 'off',
    'unicorn/prefer-string-slice': 'off',
    'unicorn/prevent-abbreviations': 'off',
  },
}
