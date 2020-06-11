'use strict'

module.exports = {
  // Ignore 'tests' directory as it contains all the integration tests
  modulePathIgnorePatterns: ['src/lambda/__tests__/fixtures/', 'tests/'],
  setupFiles: ['object.fromentries/auto.js'],
}
