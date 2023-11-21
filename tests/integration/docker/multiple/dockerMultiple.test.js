// import assert from 'node:assert'
// import { env } from 'node:process'
// import { join } from 'desm'
// import { setup, teardown } from '../../../_testHelpers/index.js'
// import { BASE_URL } from '../../../config.js'

describe('Multiple docker containers', function desc() {
  it('placeholder, node.js v12 not supported anymore', () => true)

  // beforeEach(() =>
  //   setup({
  //     servicePath: join(import.meta.url),
  //   }),
  // )

  // afterEach(() => teardown())

  // //
  // ;[
  //   {
  //     description: 'should work with multiple mixed docker containers',
  //     expected1: {
  //       message: 'Hello Node.js!',
  //     },
  //     expected2: {
  //       message: 'Hello Node.js!',
  //     },
  //     expected3: {
  //       message: 'Hello Python!',
  //     },
  //     path1: '/dev/hello1',
  //     path2: '/dev/hello2',
  //     path3: '/dev/hello3',
  //   },
  // ].forEach(
  //   ({ description, expected1, expected2, expected3, path1, path2, path3 }) => {
  //     it(description, async function it() {
  //       // "Could not find 'Docker', skipping tests."
  //       if (!env.DOCKER_DETECTED) {
  //         this.skip()
  //       }

  //       const url1 = new URL(path1, BASE_URL)
  //       const url2 = new URL(path2, BASE_URL)
  //       const url3 = new URL(path3, BASE_URL)

  //       const [response1, response2, response3] = await Promise.all([
  //         fetch(url1),
  //         fetch(url2),
  //         fetch(url3),
  //       ])

  //       const [json1, json2, json3] = await Promise.all([
  //         response1.json(),
  //         response2.json(),
  //         response3.json(),
  //       ])

  //       assert.equal(json1.message, expected1.message)
  //       assert.equal(json2.message, expected2.message)
  //       assert.equal(json3.message, expected3.message)
  //     })
  //   },
  // )
})
