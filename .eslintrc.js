'use strict';

const { env, platform } = process;

const rules = {
  'guard-for-in': 'off',
  'import/no-dynamic-require': 'off',
  'key-spacing': 'off',
  'no-restricted-syntax': 'off',
  'one-var-declaration-per-line': ['error', 'always'],
  semi: ['error', 'always'],
  strict: 'off',
};

// workaround for git + eslint line ending issue on Travis for Windows OS:
// https://travis-ci.community/t/files-in-checkout-have-eol-changed-from-lf-to-crlf/349/2
if (env.TRAVIS && platform === 'win32') {
  rules['linebreak-style'] = 'off';
}

module.exports = {
  extends: ['eslint:recommended', 'dherault', 'eslint-config-prettier'],

  plugins: ['prettier'],

  env: {
    es6: true,
    jest: true,
    node: true,
  },

  rules,
};
