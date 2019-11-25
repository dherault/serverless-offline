'use strict'

const { AWS_ENDPOINT } = process.env

module.exports = {
  globals: {
    RUN_TEST_AGAINST_AWS: AWS_ENDPOINT != null,
    TEST_BASE_URL: AWS_ENDPOINT || 'http://localhost:3000',
  },
  globalSetup: '<rootDir>/tests/_setupTeardown/npmInstall.js',
  moduleFileExtensions: ['ts', 'js'],
  modulePathIgnorePatterns: ['src/lambda/__tests__/fixtures/'],
  setupFiles: ['object.fromentries/auto.js'],
  transform: {
    '^.+\\.(js|ts)?$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
}

// module.exports = {
//   roots: ['<rootDir>/src'],
//   testMatch: [
//     '**/__tests__/**/*.+(ts|tsx|js)',
//     '**/?(*.)+(spec|test).+(ts|tsx|js)',
//   ],
//   transform: {
//     '^.+\\.(ts|tsx)?$': 'ts-jest',
//   },
// }

// module.exports = {
//   globals: {
//     RUN_TEST_AGAINST_AWS: AWS_ENDPOINT != null,
//     TEST_BASE_URL: AWS_ENDPOINT || 'http://localhost:3000',
//   },
//   globalSetup: './tests/_setupTeardown/npmInstall.js',
//   modulePathIgnorePatterns: ['src/lambda/__tests__/fixtures/'],
//   setupFiles: ['object.fromentries/auto.js'],
// }
