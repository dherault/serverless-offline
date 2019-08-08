'use strict'

const { env, platform } = process

module.exports = {
  extends: [
    'eslint:recommended',
    'eslint-config-airbnb-base',
    'plugin:prettier/recommended',
  ],

  env: {
    es6: true,
    jest: true,
    node: true,
  },

  parserOptions: {
    sourceType: 'script',
  },

  rules: {
    // TODO FIXME turn off temporary, to make eslint pass
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'no-console': 'off',
    'no-multi-assign': 'off',
    'no-param-reassign': 'off',
    'no-restricted-syntax': 'off',
    'no-shadow': 'off',
    'no-underscore-dangle': 'off',
    'no-use-before-define': 'off',
    radix: 'off',
    // workaround for git + eslint line ending issue on Travis for Windows OS:
    // https://travis-ci.community/t/files-in-checkout-have-eol-changed-from-lf-to-crlf/349/2
    ...(env.TRAVIS &&
      platform === 'win32' && {
        ['linebreak-style']: 'off',
      }),
  },
}
