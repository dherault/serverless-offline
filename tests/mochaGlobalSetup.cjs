const { env } = require('node:process')

// can be sync or async
exports.mochaGlobalSetup = function mochaGlobalSetup() {
  //   env.RUN_TEST_AGAINST_AWS = env.AWS_ENDPOINT != null
  env.TEST_BASE_URL = env.AWS_ENDPOINT || 'http://localhost:3000'
}
