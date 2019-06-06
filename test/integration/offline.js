const { expect } = require('chai');
const ServerlessBuilder = require('../support/ServerlessBuilder');
const OfflineBuilder = require('../support/OfflineBuilder');

describe('Offline', () => {
  let offline;

  before(() => {
    // Creates offline test server with no function
    offline = new OfflineBuilder(new ServerlessBuilder()).toObject();
  });

  context('with a non existing route', () => {
    it('should return 404 status code', async () => {
      const res = await offline.inject({
        method: 'GET',
        url: '/magic',
      });

      expect(res.statusCode).to.eq(404);
    });
  });

  context('with private function', () => {
    let offline;
    const validToken = 'valid-token';

    before(async () => {
      offline = new OfflineBuilder(new ServerlessBuilder(), { apiKey: validToken }).addFunctionConfig('fn2', {
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
    });

    it('should return bad request with no token', async () => {
      const res = await offline.inject({
        method: 'GET',
        url: '/fn2',
      });

      expect(res.statusCode).to.eq(403);
      expect(res.payload).to.eq(JSON.stringify({ message: 'Forbidden' }));
      expect(res.headers).to.have.property('x-amzn-errortype', 'ForbiddenException');
    });

    it('should return forbidden if token is wrong', async () => {
      const res = await offline.inject({
        method: 'GET',
        url: '/fn2',
        headers: { 'x-api-key': 'random string' },
      });

      expect(res.statusCode).to.eq(403);
      expect(res.payload).to.eq(JSON.stringify({ message: 'Forbidden' }));
      expect(res.headers).to.have.property('x-amzn-errortype', 'ForbiddenException');
    });

    it('should return the function executed correctly', async () => {
      const res = await offline.inject({
        method: 'GET',
        url: '/fn2',
        headers: { 'x-api-key': validToken },
      });

      expect(res.statusCode).to.eq(200);
      expect(res.payload).to.eq(JSON.stringify({ message: 'Private Function Executed Correctly' }));
    });

  });

  context('with private function and noAuth option set', () => {
    let offline;
    const validToken = 'valid-token';

    before(async () => {
      offline = new OfflineBuilder(new ServerlessBuilder(), { apiKey: validToken, noAuth: true }).addFunctionConfig('fn2', {
        handler: 'handler.basicAuthentication',
        events: [{
          http: {
            path: 'fn3',
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
    });

    it('should execute the function correctly if no API key is provided', async () => {
      const res = await offline.inject({
        method: 'GET',
        url: '/fn3',
      });

      expect(res.statusCode).to.eq(200);
    });

    it('should execute the function correctly if API key is provided', async () => {
      const res = await offline.inject({
        method: 'GET',
        url: '/fn3',
        headers: { 'x-api-key': validToken },
      });

      expect(res.statusCode).to.eq(200);
    });
  });

  context('lambda integration', () => {
    it('should use event defined response template and headers', async () => {
      const offline = new OfflineBuilder().addFunctionConfig('index', {
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

      const res = await offline.inject('/index');

      expect(res.headers['content-type']).to.contains('text/html');
      expect(res.statusCode).to.eq(200);
    });

    context('error handling', () => {
      it('should set the status code to 500 when no [xxx] is present', async () => {
        const offline = new OfflineBuilder().addFunctionConfig('index', {
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

        const res = await offline.inject('/index');

        expect(res.headers['content-type']).to.contains('text/html');
        expect(res.statusCode).to.satisfy(status => status === 500 || status === '500');
      });

      it('should set the status code to 401 when [401] is the prefix of the error message', async () => {
        const offline = new OfflineBuilder().addFunctionConfig('index', {
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

        const res = await offline.inject('/index');

        expect(res.headers['content-type']).to.contains('text/html');
        expect(res.statusCode).to.satisfy(status => status === 401 || status === '401');
      });
    });
  });

  context('lambda-proxy integration', () => {
    it('should accept and return application/json content type by default', async () => {
      const offline = new OfflineBuilder()
        .addFunctionHTTP('fn1', {
          path: 'fn1',
          method: 'GET',
        }, (event, context, cb) => cb(null, {
          statusCode: 200,
          body: JSON.stringify({ data: 'data' }),
        })).toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/fn1',
        payload: { data: 'data' },
      });

      expect(res.headers).to.have.property('content-type').which.contains('application/json');
    });

    it('should accept and return application/json content type', async () => {
      const offline = new OfflineBuilder()
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

      const res = await offline.inject({
        method: 'GET',
        url: '/fn1',
        headers: {
          'content-type': 'application/json',
        },
        payload: { data: 'data' },
      });

      expect(res.headers).to.have.property('content-type').which.contains('application/json');
    });

    it('should accept and return custom content type', async () => {
      const offline = new OfflineBuilder()
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

      const res = await offline.inject({
        method: 'GET',
        url: '/fn1',
        headers: {
          'content-type': 'application/vnd.api+json',
        },
        payload: { data: 'data' },
      });

      // console.log(res);
      expect(res.headers).to.have.property('content-type', 'application/vnd.api+json');
    });

    it('should return application/json content type by default', async () => {
      const offline = new OfflineBuilder()
        .addFunctionHTTP('fn1', {
          path: 'fn1',
          method: 'GET',
        }, (event, context, cb) => cb(null, {
          statusCode: 200,
          body: JSON.stringify({ data: 'data' }),
        })).toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/fn1',
      });

      expect(res.headers).to.have.property('content-type').which.contains('application/json');
    });

    it('should work with trailing slashes path', async () => {
      const offline = new OfflineBuilder().addFunctionHTTP('hello', {
        path: 'fn3/',
        method: 'GET',
      }, (event, context, cb) => cb(null, {
        statusCode: 201,
        body: null,
      })).toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/fn3',
      });

      expect(res.statusCode).to.eq(201);
    });

    it('should return the expected status code', async () => {
      const offline = new OfflineBuilder().addFunctionHTTP('hello', {
        path: 'fn1',
        method: 'GET',
      }, (event, context, cb) => cb(null, {
        statusCode: 201,
        body: null,
      })).toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/fn1',
      });

      expect(res.statusCode).to.eq(201);
    });

    it('should return that the body was not stringified', async () => {
      offline = new OfflineBuilder(new ServerlessBuilder()).addFunctionConfig('fn2', {
        handler: 'handler.unstrigifiedBody',
        events: [{
          http: {
            path: 'fn2',
            method: 'POST',
            payload: { data: 'data' },
          },
        }],
      }, (event, context, cb) => {
        if (typeof event.body !== 'string') {
          const response = {
            statusCode: 500,
            body: JSON.stringify({
              message: 'According to the API Gateway specs, the body content must be stringified. Check your Lambda response and make sure you are invoking JSON.stringify(YOUR_CONTENT) on your body object',
            }),
          };

          cb(null, response);
        }
      }).toObject();
    });

    it('should return correctly set multiple set-cookie headers', async () => {
      const offline = new OfflineBuilder()
        .addFunctionHTTP('fn1', {
          path: 'fn1',
          method: 'GET',
        }, (event, context, cb) => cb(null, {
          statusCode: 200,
          headers: { 'set-cookie': 'foo=bar', 'set-COOKIE': 'floo=baz' },
        })).toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/fn1',
      });

      expect(res.headers).to.have.property('set-cookie');
      expect(res.headers['set-cookie'].some(header => header.includes('foo=bar'))).to.be.true;
      expect(res.headers['set-cookie'].some(header => header.includes('floo=baz'))).to.be.true;
    });
  });

  context('with the stageVariables plugin', () => {
    it('should handle custom stage variables declaration', async () => {
      const offline = new OfflineBuilder().addCustom('stageVariables', { hello: 'Hello World' }).addFunctionHTTP('hello', {
        path: 'fn1',
        method: 'GET',
      }, (event, context, cb) => cb(null, {
        statusCode: 201,
        body: event.stageVariables.hello,
      })).toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/fn1',
      });

      expect(res.payload).to.eq('Hello World');
    });
  });

  context('with catch-all route', () => {
    it('should match arbitary route', async () => {
      const offline = new OfflineBuilder().addFunctionHTTP('test', {
        path: 'test/{stuff+}',
        method: 'GET',
      }, (event, context, cb) => cb(null, {
        statusCode: 200, body: 'Hello',
      })).toObject();

      const res = await offline.inject('/test/some/matching/route');

      expect(res.statusCode).to.eq(200);
      expect(res.payload).to.eq('Hello');
    });
  });

  context('does not mangle payload', () => {
    let offline;
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

    before(async () => {
      offline = new OfflineBuilder(new ServerlessBuilder()).addFunctionConfig('fn2', {
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
    });

    it('should return that the JSON was not mangled', async () => {
      const res = await offline.inject({
        method: 'POST',
        url: '/fn2',
        payload: rawBody,
      });

      expect(res.statusCode).to.eq(200);
      expect(res.payload).to.eq(JSON.stringify({ message: 'JSON body was not stripped of newlines or tabs' }));
    });

    it('should return that the JSON was not mangled with an application/json type', async () => {
      const res = await offline.inject({
        method: 'POST',
        url: '/fn2',
        payload: rawBody,
        headers: {
          'content-type': 'application/json',
        },
      });

      expect(res.statusCode).to.eq(200);
      expect(res.payload).to.eq(JSON.stringify({ message: 'JSON body was not stripped of newlines or tabs' }));
    });
  });

  context('aws runtime nodejs8.10', () => {
    const serverless = {
      service: {
        provider: {
          name: 'aws',
          stage: 'dev',
          region: 'us-east-1',
          runtime: 'nodejs8.10',
        },
      },
    };

    it('should support handler returning Promise', async () => {
      const offline = new OfflineBuilder(new ServerlessBuilder(serverless))
        .addFunctionHTTP('index', {
          path: 'index',
          method: 'GET',
        }, () => Promise.resolve({
          statusCode: 200,
          body: JSON.stringify({ message: 'Hello World' }),
        })).toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/index',
        payload: { data: 'input' },
      });

      expect(res.headers).to.have.property('content-type').which.contains('application/json');
      expect(res.statusCode).to.eq(200);
      expect(res.payload).to.eq('{"message":"Hello World"}');
    });

    it('should support handler returning Promise that defers', async () => {
      const offline = new OfflineBuilder(new ServerlessBuilder(serverless))
        .addFunctionHTTP('index', {
          path: 'index',
          method: 'GET',
        }, () =>
          new Promise(resolve =>
            setTimeout(() =>
              resolve({
                statusCode: 200,
                body: JSON.stringify({ message: 'Hello World' }),
              }),
            10)
          )
        ).toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/index',
        payload: { data: 'input' },
      });

      expect(res.headers).to.have.property('content-type').which.contains('application/json');
      expect(res.statusCode).to.eq(200);
      expect(res.payload).to.eq('{"message":"Hello World"}');
    });

    it('should support handler that defers and uses done()', async () => {
      const offline = new OfflineBuilder(new ServerlessBuilder(serverless))
        .addFunctionHTTP('index', {
          path: 'index',
          method: 'GET',
        }, (request, context, cb) =>
          setTimeout(() =>
            cb(null, {
              statusCode: 200,
              body: JSON.stringify({ message: 'Hello World' }),
            }),
          10)
        ).toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/index',
        payload: { data: 'input' },
      });

      expect(res.headers).to.have.property('content-type').which.contains('application/json');
      expect(res.statusCode).to.eq(200);
      expect(res.payload).to.eq('{"message":"Hello World"}');
    });

    it('should support handler that throws and uses done()', async () => {
      const offline = new OfflineBuilder(new ServerlessBuilder(serverless))
        .addFunctionHTTP('index', {
          path: 'index',
          method: 'GET',
        }, () => {
          throw new Error('This is an error');
        }).toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/index',
        payload: { data: 'input' },
      });

      expect(res.headers).to.have.property('content-type').which.contains('application/json');
      expect(res.statusCode).to.eq(200);
    });

    it('should support handler using async function', async () => {
      const offline = new OfflineBuilder(new ServerlessBuilder(serverless))
        .addFunctionHTTP('index', {
          path: 'index',
          method: 'GET',
        }, async () =>
          ({
            statusCode: 200,
            body: JSON.stringify({ message: 'Hello World' }),
          }),
        ).toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/index',
        payload: { data: 'input' },
      });

      expect(res.headers).to.have.property('content-type').which.contains('application/json');
      expect(res.statusCode).to.eq(200);
      expect(res.payload).to.eq('{"message":"Hello World"}');
    });

    it('should support handler that uses async function that throws', async () => {
      const offline = new OfflineBuilder(new ServerlessBuilder(serverless))
        .addFunctionHTTP('index', {
          path: 'index',
          method: 'GET',
        }, async () => {
          throw new Error('This is an error');
        }).toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/index',
        payload: { data: 'input' },
      });

      expect(res.headers).to.have.property('content-type').which.contains('application/json');
      expect(res.statusCode).to.eq(200);
    });

  });

  context('with HEAD support', () => {
    it('should skip HEAD route mapping and return 404 when requested', async () => {
      const offline = new OfflineBuilder().addFunctionHTTP('hello', {
        path: 'fn1',
        method: 'HEAD',
      }, null).toObject();

      const res = await offline.inject({
        method: 'HEAD',
        url: '/fn1',
      });

      expect(res.statusCode).to.eq(404);
    });

    it('should use GET route for HEAD requests, if exists', async () => {
      const offline = new OfflineBuilder().addFunctionHTTP('hello', {
        path: 'fn1',
        method: 'GET',
      }, (event, context, cb) => cb(null, {
        statusCode: 204,
        body: null,
      })).toObject();

      const res = await offline.inject({
        method: 'HEAD',
        url: '/fn1',
      });

      expect(res.statusCode).to.eq(204);
    });
  });

  context('static headers', () => {
    it('are returned if defined in lambda integration', async () => {
      const offline = new OfflineBuilder().addFunctionConfig('headers', {
        handler: '',
        events: [{
          http: {
            integration: 'lambda',
            method: 'GET',
            path: 'headers',
            response: {
              headers: {
                'custom-header-1': "'first value'",
                'Custom-Header-2': "'Second Value'",
                'custom-header-3': "'third's value'",
              },
            },
          },
        }],
      }, (event, context, cb) => cb(null, {})).toObject();

      const res = await offline.inject('/headers');

      expect(res.statusCode).to.eq(200);
      expect(res.headers).to.have.property('custom-header-1', 'first value');
      expect(res.headers).to.have.property('custom-header-2', 'Second Value');
      expect(res.headers).to.have.property('custom-header-3', 'third\'s value');
    });

    it('are not returned if not double-quoted strings in lambda integration', async () => {
      const offline = new OfflineBuilder().addFunctionConfig('headers', {
        handler: '',
        events: [{
          http: {
            integration: 'lambda',
            method: 'GET',
            path: 'headers',
            response: {
              headers: {
                'custom-header-1': 'first value',
                'Custom-Header-2': true,
              },
            },
          },
        }],
      }, (event, context, cb) => cb(null, {})).toObject();

      const res = await offline.inject('/headers');

      expect(res.statusCode).to.eq(200);
      expect(res.headers).not.to.have.property('custom-header-1');
      expect(res.headers).not.to.have.property('custom-header-2');
    });

    it('are not returned if defined in non-lambda integration', async () => {
      const offline = new OfflineBuilder().addFunctionConfig('headers', {
        handler: '',
        events: [{
          http: {
            integration: 'other',
            method: 'GET',
            path: 'headers',
            response: {
              headers: {
                'custom-header-1': "'first value'",
                'Custom-Header-2': "'Second Value'",
              },
            },
          },
        }],
      }, (event, context, cb) => cb(null, {})).toObject();

      const res = await offline.inject('/headers');

      expect(res.statusCode).to.eq(200);
      expect(res.headers).not.to.have.property('custom-header-1');
      expect(res.headers).not.to.have.property('custom-header-2');
    });
  });

  context('disable cookie validation', () => {
    it('should return bad reqeust by default if invalid cookies are passed by the request', async () => {
      const offline = new OfflineBuilder().addFunctionHTTP('test', {
        path: 'fn1',
        method: 'GET',
      }, (event, context, cb) => cb(null, {})).toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/fn1',
        headers: {
          Cookie: 'a.strange.cookie.with.newline.at.the.end=yummie123utuiwi-32432fe3-f3e2e32\n',
        },
      });

      expect(res.statusCode).to.eq(400);
    });

    it('should return 200 if the "disableCookieValidation"-flag is set', async () => {
      const offline = new OfflineBuilder(new ServerlessBuilder(), { disableCookieValidation: true })
        .addFunctionHTTP('test', {
          path: 'fn1',
          method: 'GET',
        }, (event, context, cb) => cb(null, {})).toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/fn1',
        headers: {
          Cookie: 'a.strange.cookie.with.newline.at.the.end=yummie123utuiwi-32432fe3-f3e2e32\n',
        },
      });

      expect(res.statusCode).to.eq(200);
    });
  });

  context('check cookie status', () => {
    it('check for isHttpOnly off', async () => {
      const offline = new OfflineBuilder().addFunctionHTTP('test', {
        path: 'fn2',
        method: 'GET',
      }, (event, context, cb) => cb(null, { headers: { 'Set-Cookie': 'mycookie=123' } })).toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/fn2',
        headers: {},
      });

      res.headers['set-cookie'].forEach(v => expect(v.match(/httponly/i)).to.eq(null));
    });

    it('check for isSecure off', async () => {
      const offline = new OfflineBuilder().addFunctionHTTP('test', {
        path: 'fn3',
        method: 'GET',
      }, (event, context, cb) => cb(null, { headers: { 'Set-Cookie': 'mycookie=123' } })).toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/fn3',
        headers: {},
      });

      res.headers['set-cookie'].forEach(v => expect(v.match(/secure/i)).to.eq(null));
    });

    it('check for isSameSite off', async () => {
      const offline = new OfflineBuilder().addFunctionHTTP('test', {
        path: 'fn4',
        method: 'GET',
      }, (event, context, cb) => cb(null, { headers: { 'Set-Cookie': 'mycookie=123' } })).toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/fn4',
        headers: {},
      });

      res.headers['set-cookie'].forEach(v => expect(v.match(/samesite/i)).to.eq(null));
    });
  });

  context('with resource routes', () => {
    let serviceBuilder;

    before(async () => {
      serviceBuilder = new ServerlessBuilder();
      serviceBuilder.serverless.service.resources = {
        Resources: {
          EchoProxyResource: {
            Type: 'AWS::ApiGateway::Resource',
            Properties: {
              PathPart: 'echo/{proxy+}',
            },
          },
          EchoProxyMethod: {
            Type: 'AWS::ApiGateway::Method',
            Properties: {
              ResourceId: {
                Ref: 'EchoProxyResource',
              },
              HttpMethod: 'ANY',
              Integration: {
                IntegrationHttpMethod: 'ANY',
                Type: 'HTTP_PROXY',
                Uri: 'http://mockbin.org/request/{proxy}',
              },
            },
          },
        },
      };
    });

    it('proxies query strings', async () => {
      const offline = new OfflineBuilder(serviceBuilder, { resourceRoutes: true }).toObject();

      const res = await offline.inject('/echo/foo?bar=baz');
      const result = JSON.parse(res.result);

      expect(result.queryString).to.have.property('bar', 'baz');
    });
  });
});
