'use strict'

module.exports = {
  hooks: {
    'pre-commit': 'yarn run lint',
    // 'pre-push': 'yarn run lint && yarn build && yarn test',
  },
}
