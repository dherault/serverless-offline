/* global describe before context it */

'use strict';

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const ServerlessBuilder = require('../support/ServerlessBuilder');
const OffLineBuilder = require('../support/OffLineBuilder');

const expect = chai.expect;
chai.use(dirtyChai);

describe('Offline', () => {
  let offline;

  before(() => {
    // Creates offline test server with no function
    offline = new OffLineBuilder(new ServerlessBuilder()).toObject();
  });

  context('with a non existing route', () => {
    it('should return 404 status code', () => {
      offline.inject({
        method: 'GET',
        url: '/magic',
      }, res => {
        expect(res.statusCode).to.eq(404);
      });
    });
  });

  context('with private function', () => {
    let offLine;
    const validToken = 'valid-token';

    before(done => {
      offLine = new OffLineBuilder(new ServerlessBuilder(), { apiKey: validToken }).addFunctionConfig('fn2', {
        handler: 'handler.basicAuthentication',
        events: [{
          http: {
            path: 'fn2',
            method: 'GET',
            private: true,
          },
        }],
      }, (event, context, cb) => {
        const response = {
          statusCode: 200,
          body: JSON.stringify({
            message: 'Private Function Executed Correctly',
          }),
        };
        cb(null, response);
      }).addApiKeys(['token']).toObject();
      done();
    });

    it('should return bad request with no token', done => {
      offLine.inject({
        method: 'GET',
        url: '/fn2',
      }, res => {
        expect(res.statusCode).to.eq(403);
        expect(res.payload).to.eq(JSON.stringify({ message: 'Forbidden' }));
        expect(res.headers).to.have.property('x-amzn-errortype', 'ForbiddenException');
        done();
      });
    });

    it('should return forbidden if token is wrong', done => {
      offLine.inject({
        method: 'GET',
        url: '/fn2',
        headers: { 'x-api-key': 'random string' },
      }, res => {
        expect(res.statusCode).to.eq(403);
        expect(res.payload).to.eq(JSON.stringify({ message: 'Forbidden' }));
        expect(res.headers).to.have.property('x-amzn-errortype', 'ForbiddenException');
        done();
      });
    });

    it('should return the function executed correctly', done => {
      const handler = {
        method: 'GET',
        url: '/fn2',
        headers: { 'x-api-key': validToken },
      };
      offLine.inject(handler, res => {
        expect(res.statusCode).to.eq(200);
        expect(res.payload).to.eq(JSON.stringify({ message: 'Private Function Executed Correctly' }));
        done();
      });
    });

  });

  context('lambda integration', () => {
    it('should use event defined response template and headers', done => {
      const offLine = new OffLineBuilder().addFunctionConfig('index', {
        handler: 'users.index',
        events: [{
          http: {
            path: 'index',
            method: 'GET',
            integration: 'lambda',
            response: {
              headers: {
                'Content-Type': "'text/html'",
              },
              template: "$input.path('$')",
            },
          },
        }],
      }, (event, context, cb) => cb(null, 'Hello World')).toObject();

      offLine.inject('/index', res => {
        expect(res.headers['content-type']).to.contains('text/html');
        expect(res.statusCode).to.satisfy(status => status === 200 || status === '200');
        done();
      });
    });

    context('error handling', () => {
      it('should set the status code to 500 when no [xxx] is present', done => {
        const offLine = new OffLineBuilder().addFunctionConfig('index', {
          handler: 'users.index',
          events: [{
            http: {
              path: 'index',
              method: 'GET',
              integration: 'lambda',
              response: {
                headers: {
                  'Content-Type': "'text/html'",
                },
                template: "$input.path('$')",
              },
            },
          }],
        }, (event, context, cb) => cb(new Error('Internal Server Error'))).toObject();

        offLine.inject('/index', res => {
          expect(res.headers['content-type']).to.contains('text/html');
          expect(res.statusCode).to.satisfy(status => status === 500 || status === '500');
          done();
        });
      });

      it('should set the status code to 401 when [401] is the prefix of the error message', done => {
        const offLine = new OffLineBuilder().addFunctionConfig('index', {
          handler: 'users.index',
          events: [{
            http: {
              path: 'index',
              method: 'GET',
              integration: 'lambda',
              response: {
                headers: {
                  'Content-Type': "'text/html'",
                },
                template: "$input.path('$')",
              },
            },
          }],
        }, (event, context, cb) => cb(new Error('[401] Unauthorized'))).toObject();

        offLine.inject('/index', res => {
          expect(res.headers['content-type']).to.contains('text/html');
          expect(res.statusCode).to.satisfy(status => status === 401 || status === '401');
          done();
        });
      });
    });
  });

  context('lambda-proxy integration', () => {
    it('should accept and return application/json content type by default', done => {
      const offLine = new OffLineBuilder()
        .addFunctionHTTP('fn1', {
          path: 'fn1',
          method: 'GET',
        }, (event, context, cb) => cb(null, {
          statusCode: 200,
          body: JSON.stringify({ data: 'data' }),
        })).toObject();

      offLine.inject({
        method: 'GET',
        url: '/fn1',
        payload: { data: 'data' },
      }, res => {
        expect(res.headers).to.have.property('content-type', 'application/json');
        done();
      });
    });

    it('should accept and return application/json content type', done => {
      const offLine = new OffLineBuilder()
        .addFunctionHTTP('fn1', {
          path: 'fn1',
          method: 'GET',
        }, (event, context, cb) => cb(null, {
          statusCode: 200,
          body: JSON.stringify({ data: 'data' }),
          headers: {
            'content-type': 'application/json',
          },
        })).toObject();

      offLine.inject({
        method: 'GET',
        url: '/fn1',
        headers: {
          'content-type': 'application/json',
        },
        payload: { data: 'data' },
      }, res => {
        expect(res.headers).to.have.property('content-type', 'application/json; charset=utf-8');
        done();
      });
    });

    it('should accept and return custom content type', done => {
      const offLine = new OffLineBuilder()
        .addFunctionHTTP('fn1', {
          path: 'fn1',
          method: 'GET',
        }, (event, context, cb) => cb(null, {
          statusCode: 200,
          body: JSON.stringify({ data: 'data' }),
          headers: {
            'content-type': 'application/vnd.api+json',
          },
        })).toObject();

      offLine.inject({
        method: 'GET',
        url: '/fn1',
        headers: {
          'content-type': 'application/vnd.api+json',
        },
        payload: { data: 'data' },
      }, res => {
        // console.log(res);
        expect(res.headers).to.have.property('content-type', 'application/vnd.api+json');
        done();
      });
    });

    it('should return application/json content type by default', done => {
      const offLine = new OffLineBuilder()
        .addFunctionHTTP('fn1', {
          path: 'fn1',
          method: 'GET',
        }, (event, context, cb) => cb(null, {
          statusCode: 200,
          body: JSON.stringify({ data: 'data' }),
        })).toObject();

      offLine.inject({
        method: 'GET',
        url: '/fn1',
      }, res => {
        expect(res.headers).to.have.property('content-type', 'application/json');
        done();
      });
    });

    it('should work with trailing slashes path', done => {
      const offLine = new OffLineBuilder().addFunctionHTTP('hello', {
        path: 'fn3/',
        method: 'GET',
      }, (event, context, cb) => cb(null, {
        statusCode: 201,
        body: null,
      })).toObject();

      offLine.inject({
        method: 'GET',
        url: '/fn3',
      }, res => {
        expect(res.statusCode).to.eq(201);
        done();
      });
    });

    it('should return the expected status code', done => {
      const offLine = new OffLineBuilder().addFunctionHTTP('hello', {
        path: 'fn1',
        method: 'GET',
      }, (event, context, cb) => cb(null, {
        statusCode: 201,
        body: null,
      })).toObject();

      offLine.inject({
        method: 'GET',
        url: '/fn1',
      }, res => {
        expect(res.statusCode).to.eq(201);
        done();
      });
    });

    context('with the stageVariables plugin', () => {
      it('should handle custom stage variables declaration', done => {
        const offLine = new OffLineBuilder().addCustom('stageVariables', { hello: 'Hello World' }).addFunctionHTTP('hello', {
          path: 'fn1',
          method: 'GET',
        }, (event, context, cb) => cb(null, {
          statusCode: 201,
          body: event.stageVariables.hello,
        })).toObject();

        offLine.inject({
          method: 'GET',
          url: '/fn1',
        }, res => {
          expect(res.payload).to.eq('Hello World');
          done();
        });
      });
    });
  });

  context('with catch-all route', () => {
    it('should match arbitary route', done => {
      const offLine = new OffLineBuilder().addFunctionHTTP('test', {
        path: 'test/{stuff+}',
        method: 'GET',
      }, (event, context, cb) => cb(null, {
        statusCode: 200, body: 'Hello',
      })).toObject();

      offLine.inject('/test/some/matching/route', res => {
        expect(res.statusCode).to.eq(200);
        expect(res.payload).to.eq('Hello');
        done();
      });
    });
  });

  context('does not mangle payload', () => {
    let offLine;
    const rawBody = `{
\t"type": "notification_event",
\t"app_id": "q8sn4hth",
\t"data": {
\t\t"type": "notification_event_data",
\t\t\t"item": {
\t\t\t\t"type": "ping",
\t\t\t\t"message": "something something interzen"
\t\t\t}
\t\t},
\t"links": {},
\t"id": null,
\t"topic": "ping",
\t"delivery_status": null,
\t"delivery_attempts": 1,
\t"delivered_at": 0,
\t"first_sent_at": 1513466985,
\t"created_at": 1513466985,
\t"self": null
}`;

    before(done => {
      offLine = new OffLineBuilder(new ServerlessBuilder()).addFunctionConfig('fn2', {
        handler: 'handler.rawJsonBody',
        events: [{
          http: {
            path: 'fn2',
            method: 'POST',
          },
        }],
      }, (event, context, cb) => {
        if (event.body === rawBody) {
          const response = {
            statusCode: 200,
            body: JSON.stringify({
              message: 'JSON body was not stripped of newlines or tabs',
            }),
          };

          cb(null, response);
        }
        else {
          cb('JSON body was mangled');
        }
        
      }).toObject();
      done();
    });

    it('should return that the JSON was not mangled', done => {
      const handler = {
        method: 'POST',
        url: '/fn2',
        payload: rawBody,
      };
      offLine.inject(handler, res => {
        expect(res.statusCode).to.eq(200);
        expect(res.payload).to.eq(JSON.stringify({ message: 'JSON body was not stripped of newlines or tabs' }));
        done();
      });
    });

    it('should return that the JSON was not mangled with an application/json type', done => {
      const handler = {
        method: 'POST',
        url: '/fn2',
        payload: rawBody,
        headers: {
          'content-type': 'application/json',
        },
      };
      offLine.inject(handler, res => {
        expect(res.statusCode).to.eq(200);
        expect(res.payload).to.eq(JSON.stringify({ message: 'JSON body was not stripped of newlines or tabs' }));
        done();
      });
    });
  });
});
