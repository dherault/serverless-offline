'use strict'

module.exports = {
  plugins: [
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: true,
      },
    ],
    '@babel/plugin-proposal-dynamic-import',
    '@babel/plugin-transform-modules-commonjs',
  ],
}
