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

  [
    {
      description: 'when handler is context.done',
      expected: 'foo',
      path: 'context-done-handler',
    },

    {
      description: 'when handler is context.done which is deferred',
      expected: 'foo',
      path: 'context-done-handler-deferred',
    },

    {
      description: 'when handler is context.succeed',
      expected: 'foo',
      path: 'context-succeed-handler',
    },

    {
      description: 'when handler is context.succeed which is deferred',
      expected: 'foo',
      path: 'context-succeed-handler-deferred',
    },

    {
      description: 'when handler is a callback',
      expected: 'foo',
      path: 'callback-handler',
    },
    {
      description: 'when handler is a callback which is deferred',
      expected: 'foo',
      path: 'callback-handler-deferred',
    },

    {
      description: 'when handler returns a promise',
      expected: 'foo',
      path: 'promise-handler',
    },

    {
      description: 'when handler a promise which is deferred',
      expected: 'foo',
      path: 'promise-handler-deferred',
    },

    {
      description: 'when handler is an async function',
      expected: 'foo',
      path: 'async-function-handler',
    },

    // NOTE: mix and matching of callbacks and promises is not recommended,
    // nonetheless, we test some of the behaviour to match AWS execution precedence
    {
      description:
        'when handler returns a callback but defines a callback parameter',
      expected: 'Hello Promise!',
      path: 'promise-with-defined-callback-handler',
    },

    // TODO: reactivate!
    // {
    //   description: 'when handler calls context.succeed and context.done',
    //   expected: 'Hello Context.succeed!',
    //   path: 'context-succeed-with-context-done-handler',
    // },

    // TODO: reactivate!
    // {
    //   description: 'when handler calls callback and context.done',
    //   expected: 'Hello Callback!',
    //   path: 'callback-with-context-done-handler',
    // },

    // TODO: reactivate!
    // {
    //   description: 'when handler calls callback and returns Promise',
    //   expected: 'Hello Callback!',
    //   path: 'callback-with-promise-handler',
    // },

    // TODO: reactivate!
    // {
    //   description: 'when handler calls callback inside returned Promise',
    //   expected: 'Hello Callback!',
    //   path: 'callback-inside-promise-handler',
    // },
  ].forEach(({ description, expected, path }) => {
    test(description, async () => {
      url.pathname = path;
      const response = await fetch(url);
      const json = await response.json();
      expect(json).toEqual(expected);
    });
  });
});
