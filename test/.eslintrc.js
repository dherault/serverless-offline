'use strict';

const rules = {
  // https://github.com/eslint/eslint/issues/2102
  'no-unused-expressions': 'off',
};

module.exports = {
  env: {
    mocha: true,
  },
  rules,
};
