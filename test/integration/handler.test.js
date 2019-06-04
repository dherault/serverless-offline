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
          statusCode: 200,
          body: stringify({ data: 'foo' }),
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
        // eslint-disable-next-line arrow-body-style
        () => {
          // NOTE: return promise explicitly!
          return Promise.reject(new Error('foo'));
        },
      ],
      [
        'when async function handler throws',
        async () => {
          throw new Error('foo');
        },
      ],
      [
        'when callback returns error',
        (event, context, callback) => {
          callback(new Error('foo'));
        },
      ],
      [
        'when context.done returns error',
        (event, context) => {
          context.done(new Error('foo'));
        },
      ],
      [
        'when context.fail returns error',
        (event, context) => {
          context.fail(new Error('foo'));
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
});
