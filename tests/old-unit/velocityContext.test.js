import assert from 'node:assert'
import VelocityContext from '../../src/events/http/lambda-events/VelocityContext.js'

describe('#urlDecode', () => {
  it('should decode url query parameters', () => {
    const fakeRequest = {
      headers: {},
      info: {},
      method: 'post',
      raw: {
        req: {
          rawHeaders: null,
        },
      },
      route: {},
    }

    const velocity = new VelocityContext(fakeRequest, 'dev', {}).getContext()

    const tests = [
      ['%3E%2C%2F%3F%3A%3B%27%22%5B%5D%5C%7B%7D%7C', '>,/?:;\'"[]\\{}|'],
      ['%20%21%40%23%24%25%5E%26%2A%28%29%2B%3D%60%3C', ' !@#$%^&*()+=`<'],
      ['%D0%80%D0%81%D0%82%D0%83%D0%84%D0%85%D0%86%D0%87%D0%88', 'ЀЁЂЃЄЅІЇЈ'],
      ['Rock%2b%26%2bRoll', 'Rock+&+Roll'],
      ['Rock%20%26%20Roll', 'Rock & Roll'],
      ['Rock+%26+Roll', 'Rock & Roll'],
    ]

    tests.forEach((test) => {
      const [key, value] = test
      assert.strictEqual(velocity.util.urlDecode(key), value)
    })
  })
})
