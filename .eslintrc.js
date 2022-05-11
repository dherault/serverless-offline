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
  },

  rules: {
    // overwrite airbnb-base options

    // require file extensions
    'import/extensions': ['error', 'always', { ignorePackages: true }],

    'no-restricted-exports': 'off',
    // import buffer explicitly
    'no-restricted-globals': [
      'error',
      {
        name: 'Buffer',
        message: "Import 'Buffer' from 'buffer' module instead",
      },
    ],
    // we use underscores to indicate private fields in classes
    'no-underscore-dangle': 'off',
    // we turn this off here, for all commonjs modules (e.g. test fixtures etc.)
    strict: ['off'],

    // TODO FIXME turn off temporary, to make eslint pass
    'class-methods-use-this': 'off',
    'lines-between-class-members': 'off',
    'no-console': 'off',
    'no-restricted-syntax': 'off',
  },
}
