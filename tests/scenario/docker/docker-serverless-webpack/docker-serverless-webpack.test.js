// import assert from 'node:assert'
// import { env } from 'node:process'
// import { join } from 'desm'
// import { setup, teardown } from '../../../_testHelpers/index.js'
// import { BASE_URL } from '../../../config.js'
// import installNpmModules from '../../../installNpmModules.js'

describe('docker and serverless-webpack', function desc() {
  it('placeholder, node.js v12 not supported anymore', () => true)

  // before(async () => {
  //   await installNpmModules(join(import.meta.url, 'app'))
  // })

  // beforeEach(async () => {
  //   await setup({
  //     servicePath: join(import.meta.url, 'app'),
  //   })
  // })

  // afterEach(() => teardown())

  // it('should work with docker and serverless-webpack', async function it() {
  //   // "Could not find 'Docker', skipping tests."
  //   if (!env.DOCKER_DETECTED) {
  //     this.skip()
  //   }

  //   const url = new URL('/dev/docker-serverless-webpack', BASE_URL)
  //   const response = await fetch(url)
  //   const json = await response.json()

  //   const expected = {
  //     hello: 'docker and serverless-webpack!',
  //   }

  //   assert.deepEqual(json, expected)
  // })
})
