'use strict';

const { env, platform } = process;

const rules = {
  'guard-for-in': 'off',
  'import/no-dynamic-require': 'off',
  'key-spacing': 'off',
  'no-restricted-syntax': 'off',
  'prefer-destructuring': 'off',
  semi: ['error', 'always'],
  strict: 'off',
};

// workaround for git + eslint line ending issue on Travis for Windows OS:
// https://travis-ci.community/t/files-in-checkout-have-eol-changed-from-lf-to-crlf/349/2
if (env.TRAVIS && platform === 'win32') {
  rules['linebreak-style'] = 'off';
}

module.exports = {
  extends: 'dherault',
  rules,
  env: {
    node: true,
    mocha: true,
  },
};
