const { expect } = require('chai');
const ServerlessBuilder = require('../support/ServerlessBuilder');
const OfflineBuilder = require('../support/OfflineBuilder');

const { parse, stringify } = JSON;

describe('handler tests', () => {
  describe("should return 'Internal server error'", () => {
    [
      ['when handler returns undefined', () => undefined],
      ['when handler returns null', () => null],
      [
        'when handler returns payload object',
        () => ({
          body: stringify({ data: 'foo' }),
          statusCode: 200,
        }),
      ],
      [
        'when handler throws',
        () => {
          throw new Error('foo');
        },
      ],
      [
        'when handler returns rejected Promise',
        () => Promise.reject(new Error('foo')),
      ],
      [
        'when handler that defers returns rejected Promise',
        () =>
          new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error('foo')), 10);
          }),
      ],
      [
        'when async function handler throws',
        async () => {
          throw new Error('foo');
        },
      ],
      [
        'when callback returns undefined',
        (event, context, callback) => {
          callback();
        },
      ],
      [
        'when callback returns null',
        (event, context, callback) => {
          callback(null);
        },
      ],
      [
        'when callback returns string',
        (event, context, callback) => {
          callback(null, 'success');
        },
      ],
      [
        'when callback returns error',
        (event, context, callback) => {
          callback(new Error('foo'));
        },
      ],
      [
        'when callback returns error and payload object',
        (event, context, callback) => {
          callback(new Error('foo'), {
            body: stringify({ data: 'foo' }),
            statusCode: 200,
          });
        },
      ],
      [
        'when callback that defers returns error',
        (event, context, callback) => {
          setTimeout(() => {
            callback(new Error('foo'));
          }, 10);
        },
      ],
      [
        'when context.done returns undefined',
        (event, context) => {
          context.done();
        },
      ],
      [
        'when context.done returns null',
        (event, context) => {
          context.done(null);
        },
      ],
      [
        'when context.done returns error',
        (event, context) => {
          context.done(new Error('foo'));
        },
      ],
      [
        'when context.done returns error and payload object',
        (event, context) => {
          context.done(new Error('foo'), {
            body: stringify({ data: 'foo' }),
            statusCode: 200,
          });
        },
      ],
      [
        'when context.done that defers returns error',
        (event, context) => {
          setTimeout(() => {
            context.done(new Error('foo'));
          }, 10);
        },
      ],
      [
        'when context.succeed returns undefined',
        (event, context) => {
          context.succeed();
        },
      ],
      [
        'when context.succeed returns null',
        (event, context) => {
          context.succeed(null);
        },
      ],
      [
        'when context.succeed returns string',
        (event, context) => {
          context.succeed('success');
        },
      ],
      [
        'when context.fail returns undefined',
        (event, context) => {
          context.fail();
        },
      ],
      [
        'when context.fail returns null',
        (event, context) => {
          context.fail(null);
        },
      ],
      [
        'when context.fail returns error',
        (event, context) => {
          context.fail(new Error('foo'));
        },
      ],
      [
        'when context.fail that defers returns error',
        (event, context) => {
          setTimeout(() => {
            context.fail(new Error('foo'));
          }, 10);
        },
      ],
    ].forEach(([description, handler]) => {
      it(description, async () => {
        const offline = new OfflineBuilder(new ServerlessBuilder())
          .addFunctionHTTP(
            'index',
            {
              method: 'GET',
              path: 'index',
            },
            handler,
          )
          .toObject();

        const response = await offline.inject({
          method: 'GET',
          url: '/index',
        });

        const expectedResponse = {
          message: 'Internal server error',
        };

        expect(response.headers)
          .to.have.property('content-type')
          .which.contains('application/json');
        expect(response.statusCode).to.eq(502);
        expect(parse(response.payload)).to.deep.equal(expectedResponse);
      });
    });
  });

  // NOTE: mix and matching of callbacks and promises is not recommended,
  // nonetheless, we test some of the behaviour to match AWS execution precedence
  describe('execution precedence)', () => {
    [
      {
        // we deliberately test the case where a 'callback' is defined
        // in the handler, but a promise is being returned to protect from a
        // potential naive implementation, e.g.
        //
        // const { promisify } = 'utils'
        // const promisifiedHandler = handler.length === 3 ? promisify(handler) : handler
        //
        // if someone would return a promise, but also defines callback, without using it
        // the handler would not be returning anything
        description: '...',
        // eslint-disable-next-line no-unused-vars
        handler: (event, context, callback) => {
          return Promise.resolve({
            statusCode: 200,
            message: JSON.stringify({ message: 'Hello Promise' }),
          });
        },
        expectedResponse: {
          message: 'Hello Context.succeed',
        },
      },

      {
        description: '...',
        handler: (event, context) => {
          context.succeed({
            body: JSON.stringify({ message: 'Hello Context.succeed' }),
            statusCode: 200,
          });

          context.done({
            body: JSON.stringify({ message: 'Hello Context.done' }),
            statusCode: 200,
          });
        },
        expectedResponse: {
          message: 'Hello Context.succeed',
        },
      },

      {
        description: '...',
        handler: (event, context, callback) => {
          callback(null, {
            body: JSON.stringify({ message: 'Hello Callback' }),
            statusCode: 200,
          });

          context.done(null, {
            body: JSON.stringify({ message: 'Hello Context.done' }),
            statusCode: 200,
          });
        },
        expectedResponse: {
          message: 'Hello Callback',
        },
      },

      {
        description: '...',
        handler: (event, context, callback) => {
          callback(null, {
            body: JSON.stringify({ message: 'Hello Callback' }),
            statusCode: 200,
          });

          return Promise.resolve({
            body: JSON.stringify({ message: 'Hello Promise' }),
            statusCode: 200,
          });
        },
        expectedResponse: {
          message: 'Hello Callback',
        },
      },

      {
        description: '...',
        handler: (event, context, callback) => {
          return new Promise(resolve => {
            callback(null, {
              body: JSON.stringify({ message: 'Hello Callback' }),
              statusCode: 200,
            });

            resolve({
              body: JSON.stringify({ message: 'Hello Promise' }),
              statusCode: 200,
            });
          });
        },
        expectedResponse: {
          message: 'Hello Callback',
        },
      },

    ].forEach(testCase => {
      const { description, handler, expectedResponse } = testCase;

      it(description, async () => {
        const offline = new OfflineBuilder(new ServerlessBuilder())
          .addFunctionHTTP(
            'index',
            {
              method: 'GET',
              path: 'index',
            },
            handler,
          )
          .toObject();

        const response = await offline.inject({
          method: 'GET',
          url: '/index',
        });

        expect(response.headers)
          .to.have.property('content-type')
          .which.contains('application/json');
        expect(response.statusCode).to.eq(200);
        expect(parse(response.payload)).to.deep.equal(expectedResponse);
      });
    });
  });
});
