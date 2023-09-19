// import assert from 'node:assert'
// import { env } from 'node:process'
// import { Server } from '@hapi/hapi'
// import { join } from 'desm'
// import { setup, teardown } from '../../../_testHelpers/index.js'
// import installNpmModules from '../../../installNpmModules.js'
// import { BASE_URL } from '../../../config.js'

describe('Access host with Docker tests', function desc() {
  it('placeholder, node.js v12 not supported anymore', () => true)

  // let server
  // beforeEach(async () => {
  //   await installNpmModules(join(import.meta.url, 'src'))
  // })
  // beforeEach(async () => {
  //   server = new Server({ port: 8080 })
  //   server.route({
  //     handler() {
  //       return 'Hello Node.js!'
  //     },
  //     method: 'GET',
  //     path: '/hello',
  //   })
  //   await server.start()
  //   await setup({
  //     servicePath: join(import.meta.url),
  //   })
  // })
  // afterEach(async () => {
  //   await server.stop()
  //   await teardown()
  // })
  // //
  // ;[
  //   {
  //     description: 'should access host in docker container',
  //     expected: {
  //       message: 'Hello Node.js!',
  //     },
  //     path: '/dev/hello',
  //   },
  // ].forEach(({ description, expected, path }) => {
  //   it(description, async function it() {
  //     // "Could not find 'Docker', skipping tests."
  //     if (!env.DOCKER_DETECTED) {
  //       this.skip()
  //     }
  //     const url = new URL(path, BASE_URL)
  //     const response = await fetch(url)
  //     const json = await response.json()
  //     assert.deepEqual(json, expected)
  //   })
  // })
})
