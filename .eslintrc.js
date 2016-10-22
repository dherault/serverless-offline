module.exports = {
    extends: 'airbnb-base',
    plugins: [],
    env: {
        browser: false,
        node: true,
    },
    rules: {
      'arrow-parens': 0,
      'brace-style': 0,
      'class-methods-use-this': 0,
      'consistent-return': 0,
      'curly': ['error', 'multi-line'],
      'global-require': 0,
      'guard-for-in': 0,
      'key-spacing': 0, // !
      'max-len': 0,
      'no-confusing-arrow': 0,
      'no-console': 0,
      'no-continue': 0,
      'no-param-reassign': 0,
      'no-restricted-syntax': 0,
      'no-shadow': 0,
      'no-trailing-spaces': ['error', { 'skipBlankLines': true }],
      'no-underscore-dangle': 0,
      'padded-blocks': 0,
      'prefer-rest-params': 0,
      'radix': 0,
      'strict': 0,
    }
};
