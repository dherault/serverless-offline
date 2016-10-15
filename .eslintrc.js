module.exports = {
    extends: 'airbnb-base',
    plugins: [],
    env: {
        browser: false,
        node: true,
    },
    rules: {
      'max-len': 0,
      'no-underscore-dangle': 0,
      'no-console': 0,
      'strict': 0,
      'key-spacing': 0, // !
      'padded-blocks': 0,
      'global-require': 0,
      'consistent-return': 0,
      'guard-for-in': 0,
      'no-restricted-syntax': 0,
      'brace-style': 0,
      'curly': ['error', 'multi-line'],
      'no-confusing-arrow': 0,
      'no-shadow': 0,
      'prefer-rest-params': 0,
      'no-trailing-spaces': ['error', { 'skipBlankLines': true }],
      'radix': 0,
      'no-continue': 0,
      'no-param-reassign': 0,
    }
};
