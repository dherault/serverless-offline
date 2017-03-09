/* global describe before after context it beforeEach afterEach */

'use strict';

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const ServerlessBuilder = require('../support/ServerlessBuilder');
const OffLineBuilder = require('../support/OffLineBuilder');

const expect = chai.expect;
chai.use(dirtyChai);

describe('Offline', () => {
  context('with a non existing route', () => {
    let offline;

    beforeEach(() => {
      offline = new OffLineBuilder(new ServerlessBuilder()).toObject();
    });

    afterEach(() => {
      offline.restore();
    });

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
    let offline;
    const validToken = 'valid-token';

    beforeEach(done => {
      offline = new OffLineBuilder(new ServerlessBuilder(), { apiKey: validToken }).addFunctionConfig('fn2', {
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

    afterEach(() => {
      offline.restore();
    });

    it('should return bad request with no token', done => {
      offline.inject({
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
      offline.inject({
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
      offline.inject(handler, res => {
        expect(res.statusCode).to.eq(200);
        expect(res.payload).to.eq(JSON.stringify({ message: 'Private Function Executed Correctly' }));
        done();
      });
    });

  });

  context('lambda integration', () => {
    it('should use event defined response template and headers', done => {
      const offline = new OffLineBuilder().addFunctionConfig('index', {
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

      offline.inject('/index', res => {
        expect(res.headers['content-type']).to.contains('text/html');
        expect(res.statusCode).to.eq('200');

        offline.restore();
        done();
      });
    });

    context('error handling', () => {
      let offline;

      afterEach(() => {
        offline.restore();
      });

      it('should set the status code to 500 when no [xxx] is present', done => {
        offline = new OffLineBuilder().addFunctionConfig('index', {
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

        offline.inject('/index', res => {
          expect(res.headers['content-type']).to.contains('text/html');
          expect(res.statusCode).to.eq('500');
          done();
        });
      });

      it('should set the status code to 401 when [401] is the prefix of the error message', done => {
        offline = new OffLineBuilder().addFunctionConfig('index', {
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

        offline.inject('/index', res => {
          expect(res.headers['content-type']).to.contains('text/html');
          expect(res.statusCode).to.eq('401');
          done();
        });
      });
    });
  });

  context('lambda-proxy integration', () => {
    let offline;

    afterEach(() => {
      offline.restore();
    });

    it('should accept and return application/json content type by default', done => {
      offline = new OffLineBuilder()
        .addFunctionHTTP('fn1', {
          path: 'fn1',
          method: 'GET',
        }, (event, context, cb) => cb(null, {
          statusCode: 200,
          body: JSON.stringify({ data: 'data' }),
        })).toObject();

      offline.inject({
        method: 'GET',
        url: '/fn1',
        payload: { data: 'data' },
      }, res => {
        expect(res.headers).to.have.property('content-type', 'application/json');
        done();
      });
    });

    it('should accept and return application/json content type', done => {
      offline = new OffLineBuilder()
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

      offline.inject({
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
      offline = new OffLineBuilder()
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

      offline.inject({
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
      offline = new OffLineBuilder()
        .addFunctionHTTP('fn1', {
          path: 'fn1',
          method: 'GET',
        }, (event, context, cb) => cb(null, {
          statusCode: 200,
          body: JSON.stringify({ data: 'data' }),
        })).toObject();

      offline.inject({
        method: 'GET',
        url: '/fn1',
      }, res => {
        expect(res.headers).to.have.property('content-type', 'application/json');
        done();
      });
    });

    it('should work with trailing slashes path', done => {
      offline = new OffLineBuilder().addFunctionHTTP('hello', {
        path: 'fn3/',
        method: 'GET',
      }, (event, context, cb) => cb(null, {
        statusCode: 201,
        body: null,
      })).toObject();

      offline.inject({
        method: 'GET',
        url: '/fn3',
      }, res => {
        expect(res.statusCode).to.eq(201);
        done();
      });
    });

    it('should return the expected status code', done => {
      offline = new OffLineBuilder().addFunctionHTTP('hello', {
        path: 'fn1',
        method: 'GET',
      }, (event, context, cb) => cb(null, {
        statusCode: 201,
        body: null,
      })).toObject();

      offline.inject({
        method: 'GET',
        url: '/fn1',
      }, res => {
        expect(res.statusCode).to.eq(201);
        done();
      });
    });

    context('with the stageVariables plugin', () => {

      it('should handle custom stage variables declaration', done => {
        offline = new OffLineBuilder().addCustom('stageVariables', { hello: 'Hello World' }).addFunctionHTTP('hello', {
          path: 'fn1',
          method: 'GET',
        }, (event, context, cb) => cb(null, {
          statusCode: 201,
          body: event.stageVariables.hello,
        })).toObject();

        offline.inject({
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
    let offline;

    afterEach(() => {
      offline.restore();
    });

    it('should match arbitary route', done => {
      offline = new OffLineBuilder().addFunctionHTTP('test', {
        path: 'test/{stuff+}',
        method: 'GET',
      }, (event, context, cb) => cb(null, {
        statusCode: 200, body: 'Hello',
      })).toObject();

      offline.inject('/test/some/matching/route', res => {
        expect(res.statusCode).to.eq(200);
        expect(res.payload).to.eq('Hello');
        done();
      });
    });
  });
});
