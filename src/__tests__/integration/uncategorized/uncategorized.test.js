'use strict';

const { resolve } = require('path');
const { URL } = require('url');
const fetch = require('node-fetch');
const Serverless = require('serverless');
const ServerlessOffline = require('../../../../src/ServerlessOffline.js');

jest.setTimeout(30000);

describe('handler payload tests', () => {
  let serverlessOffline;

  // init
  beforeAll(async () => {
    const serverless = new Serverless();
    serverless.config.servicePath = resolve(__dirname);
    await serverless.init();
    serverlessOffline = new ServerlessOffline(serverless, {});

    return serverlessOffline.start();
  });

  // cleanup
  afterAll(async () => {
    return serverlessOffline.end();
  });

  const url = new URL('http://localhost:3000');

  // issue: https://github.com/dherault/serverless-offline/issues/756
  // PR: https://github.com/dherault/serverless-offline/pull/757
  test('Uncategorized 1', async () => {
    url.pathname = 'uncategorized-1';
    const response = await fetch(url);
    const json = await response.json();
    expect(json).toEqual({ foo: 'bar' });
  });
});
