'use strict'

module.exports = {
  env: {
    es2021: true,
    mocha: true,
  },

  extends: [
    'eslint:recommended',
    'eslint-config-airbnb-base',
    'plugin:prettier/recommended',
  ],

  globals: {
    // TODO remove `node-fetch` module with node.js v18+ support
    // TODO file bug with eslint? those should be global now
    fetch: true,
    Headers: true,
  },

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
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': [
      'error',
      {
        allow: ['__dirname', '__offline_payload__', '_rawDebug'],
      },
    ],
  },
}
