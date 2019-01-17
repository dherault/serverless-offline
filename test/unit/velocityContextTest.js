/* global describe it */
const chai = require('chai');

const expect = chai.expect;

const createVelocityContext = require('../../src/createVelocityContext');


describe('#urlDecode', () => {
  it('should decode url query parameters', () => {
    const fakeRequest = {
      method: 'post',
      info: {},
      headers: {},
      route: {},
    };

    const velocity = createVelocityContext(fakeRequest, {}, {});

    const tests = [
      { '%3E%2C%2F%3F%3A%3B%27%22%5B%5D%5C%7B%7D%7C': '>,/?:;\'"[]\\{}|' },
      { '%20%21%40%23%24%25%5E%26%2A%28%29%2B%3D%60%3C': ' !@#$%^&*()+=`<' },
      { '%D0%80%D0%81%D0%82%D0%83%D0%84%D0%85%D0%86%D0%87%D0%88': 'ЀЁЂЃЄЅІЇЈ' },
      { 'Rock%2b%26%2bRoll': 'Rock+&+Roll' },
      { 'Rock%20%26%20Roll': 'Rock & Roll' },
      { 'Rock+%26+Roll': 'Rock & Roll' },
    ];

    tests.forEach(test => {
      const key = Object.keys(test)[0];
      expect(velocity.util.urlDecode(key)).to.equal(test[key]);
    });
  });
});
