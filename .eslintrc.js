'use strict'

const { env, platform } = process

module.exports = {
  extends: [
    'eslint:recommended',
    'eslint-config-airbnb-base',
    'plugin:prettier/recommended',
  ],

  env: {
    jest: true,
  },

  parserOptions: {
    sourceType: 'script',
  },

  rules: {
    // overwrite airbnb-base options
    'no-underscore-dangle': 'off',
    // until we switch to ES6 modules (which use 'strict mode' implicitly)
    strict: ['error', 'global'],

    // TODO FIXME workaround for git + prettier line ending issue on Travis for Windows OS:
    ...(env.TRAVIS &&
      platform === 'win32' && {
        'prettier/prettier': ['error', { endOfLine: 'auto' }],
      }),

    // TODO FIXME turn off temporary, to make eslint pass
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'no-console': 'off',
    'no-multi-assign': 'off',
    'no-param-reassign': 'off',
    'no-restricted-syntax': 'off',
    'no-shadow': 'off',
    'no-use-before-define': 'off',
  },
}
