'use strict'

module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: '14.18.0',
        },
        exclude: ['proposal-dynamic-import'],
      },
    ],
  ],
}
