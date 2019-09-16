'use strict';

const ServerlessBuilder = require('../support/ServerlessBuilder');
const OfflineBuilder = require('../support/OfflineBuilder');

describe('Offline', () => {
  let offline;

  beforeEach(() => {
    // Creates offline test server with no function
    offline = new OfflineBuilder(new ServerlessBuilder()).toObject();
  });

  describe('with a non existing route', () => {
    test('should return 404 status code', async () => {
      const res = await offline.inject({
        method: 'GET',
        url: '/magic',
      });

      expect(res.statusCode).toEqual(404);
    });
  });

  describe('with private function', () => {
    let offline;
    const validToken = 'valid-token';

    beforeEach(() => {
      offline = new OfflineBuilder(new ServerlessBuilder(), {
        apiKey: validToken,
      })
        .addFunctionConfig(
          'fn2',
          {
            events: [
              {
                http: {
                  path: 'fn2',
                  method: 'GET',
                  private: true,
                },
              },
            ],
            handler: 'handler.basicAuthentication',
          },
          (event, context, cb) => {
            const response = {
              body: JSON.stringify({
                message: 'Private Function Executed Correctly',
              }),
              statusCode: 200,
            };
            cb(null, response);
          },
        )
        .addApiKeys(['token'])
        .toObject();
    });

    test('should return bad request with no token', async () => {
      const res = await offline.inject({
        method: 'GET',
        url: '/fn2',
      });

      expect(res.statusCode).toEqual(403);
      expect(res.payload).toEqual(JSON.stringify({ message: 'Forbidden' }));
      expect(res.headers).toHaveProperty(
        'x-amzn-errortype',
        'ForbiddenException',
      );
    });

    test('should return forbidden if token is wrong', async () => {
      const res = await offline.inject({
        headers: { 'x-api-key': 'random string' },
        method: 'GET',
        url: '/fn2',
      });

      expect(res.statusCode).toEqual(403);
      expect(res.payload).toEqual(JSON.stringify({ message: 'Forbidden' }));
      expect(res.headers).toHaveProperty(
        'x-amzn-errortype',
        'ForbiddenException',
      );
    });

    test('should return the function executed correctly', async () => {
      const res = await offline.inject({
        headers: { 'x-api-key': validToken },
        method: 'GET',
        url: '/fn2',
      });

      expect(res.statusCode).toEqual(200);
      expect(res.payload).toEqual(
        JSON.stringify({ message: 'Private Function Executed Correctly' }),
      );
    });
  });

  describe('with private function and noAuth option set', () => {
    let offline;
    const validToken = 'valid-token';

    beforeEach(async () => {
      offline = new OfflineBuilder(new ServerlessBuilder(), {
        apiKey: validToken,
        noAuth: true,
      })
        .addFunctionConfig(
          'fn2',
          {
            events: [
              {
                http: {
                  path: 'fn3',
                  method: 'GET',
                  private: true,
                },
              },
            ],
            handler: 'handler.basicAuthentication',
          },
          (event, context, cb) => {
            const response = {
              body: JSON.stringify({
                message: 'Private Function Executed Correctly',
              }),
              statusCode: 200,
            };
            cb(null, response);
          },
        )
        .addApiKeys(['token'])
        .toObject();
    });

    test('should execute the function correctly if no API key is provided', async () => {
      const res = await offline.inject({
        method: 'GET',
        url: '/fn3',
      });

      expect(res.statusCode).toEqual(200);
    });

    test('should execute the function correctly if API key is provided', async () => {
      const res = await offline.inject({
        headers: { 'x-api-key': validToken },
        method: 'GET',
        url: '/fn3',
      });

      expect(res.statusCode).toEqual(200);
    });
  });

  describe('lambda integration', () => {
    test('should use event defined response template and headers', async () => {
      const offline = new OfflineBuilder()
        .addFunctionConfig(
          'index',
          {
            events: [
              {
                http: {
                  integration: 'lambda',
                  method: 'GET',
                  path: 'index',
                  response: {
                    headers: {
                      'Content-Type': "'text/html'",
                    },
                    template: "$input.path('$')",
                  },
                },
              },
            ],
            handler: 'users.index',
          },
          (event, context, cb) => cb(null, 'Hello World'),
        )
        .toObject();

      const res = await offline.inject('/index');

      expect(res.headers['content-type']).toMatch('text/html');
      expect(res.statusCode).toEqual(200);
    });

    describe('error handling', () => {
      test('should set the status code to 500 when no [xxx] is present', async () => {
        const offline = new OfflineBuilder()
          .addFunctionConfig(
            'index',
            {
              events: [
                {
                  http: {
                    integration: 'lambda',
                    method: 'GET',
                    path: 'index',
                    response: {
                      headers: {
                        'Content-Type': "'text/html'",
                      },
                      template: "$input.path('$')",
                    },
                  },
                },
              ],
              handler: 'users.index',
            },
            (event, context, cb) => cb(new Error('Internal Server Error')),
          )
          .toObject();

        const res = await offline.inject('/index');

        expect(res.headers['content-type']).toMatch('text/html');
        expect(res.statusCode).toEqual(500 || '500');
      });

      test('should set the status code to 401 when [401] is the prefix of the error message', async () => {
        const offline = new OfflineBuilder()
          .addFunctionConfig(
            'index',
            {
              events: [
                {
                  http: {
                    integration: 'lambda',
                    method: 'GET',
                    path: 'index',
                    response: {
                      headers: {
                        'Content-Type': "'text/html'",
                      },
                      template: "$input.path('$')",
                    },
                  },
                },
              ],
              handler: 'users.index',
            },
            (event, context, cb) => cb(new Error('[401] Unauthorized')),
          )
          .toObject();

        const res = await offline.inject('/index');

        expect(res.headers['content-type']).toMatch('text/html');
        expect(res.statusCode).toEqual(401 || '401');
      });
    });
  });

  describe('lambda-proxy integration', () => {
    test('should accept and return application/json content type by default', async () => {
      const offline = new OfflineBuilder()
        .addFunctionHTTP(
          'fn1',
          {
            method: 'GET',
            path: 'fn1',
          },
          (event, context, cb) =>
            cb(null, {
              body: JSON.stringify({ data: 'data' }),
              statusCode: 200,
            }),
        )
        .toObject();

      const res = await offline.inject({
        method: 'GET',
        payload: { data: 'data' },
        url: '/fn1',
      });

      expect(res.headers['content-type']).toMatch('application/json');
    });

    test('should accept and return application/json content type', async () => {
      const offline = new OfflineBuilder()
        .addFunctionHTTP(
          'fn1',
          {
            method: 'GET',
            path: 'fn1',
          },
          (event, context, cb) =>
            cb(null, {
              body: JSON.stringify({ data: 'data' }),
              headers: {
                'content-type': 'application/json',
              },
              statusCode: 200,
            }),
        )
        .toObject();

      const res = await offline.inject({
        headers: {
          'content-type': 'application/json',
        },
        method: 'GET',
        payload: { data: 'data' },
        url: '/fn1',
      });

      expect(res.headers['content-type']).toMatch('application/json');
    });

    test('should accept and return custom content type', async () => {
      const offline = new OfflineBuilder()
        .addFunctionHTTP(
          'fn1',
          {
            method: 'GET',
            path: 'fn1',
          },
          (event, context, cb) =>
            cb(null, {
              body: JSON.stringify({ data: 'data' }),
              headers: {
                'content-type': 'application/vnd.api+json',
              },
              statusCode: 200,
            }),
        )
        .toObject();

      const res = await offline.inject({
        headers: {
          'content-type': 'application/vnd.api+json',
        },
        method: 'GET',
        payload: { data: 'data' },
        url: '/fn1',
      });

      // console.log(res);
      expect(res.headers).toHaveProperty(
        'content-type',
        'application/vnd.api+json',
      );
    });

    test('should return application/json content type by default', async () => {
      const offline = new OfflineBuilder()
        .addFunctionHTTP(
          'fn1',
          {
            method: 'GET',
            path: 'fn1',
          },
          (event, context, cb) =>
            cb(null, {
              body: JSON.stringify({ data: 'data' }),
              statusCode: 200,
            }),
        )
        .toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/fn1',
      });

      expect(res.headers['content-type']).toMatch('application/json');
    });

    test('should work with trailing slashes path', async () => {
      const offline = new OfflineBuilder()
        .addFunctionHTTP(
          'hello',
          {
            method: 'GET',
            path: 'fn3/',
          },
          (event, context, cb) =>
            cb(null, {
              body: null,
              statusCode: 201,
            }),
        )
        .toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/fn3',
      });

      expect(res.statusCode).toEqual(201);
    });

    test('should return the expected status code', async () => {
      const offline = new OfflineBuilder()
        .addFunctionHTTP(
          'hello',
          {
            method: 'GET',
            path: 'fn1',
          },
          (event, context, cb) =>
            cb(null, {
              body: null,
              statusCode: 201,
            }),
        )
        .toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/fn1',
      });

      expect(res.statusCode).toEqual(201);
    });

    test('should return that the body was not stringified', async () => {
      offline = new OfflineBuilder(new ServerlessBuilder())
        .addFunctionConfig(
          'fn2',
          {
            events: [
              {
                http: {
                  path: 'fn2',
                  method: 'POST',
                  payload: { data: 'data' },
                },
              },
            ],
            handler: 'handler.unstrigifiedBody',
          },
          (event, context, cb) => {
            if (typeof event.body !== 'string') {
              const response = {
                body: JSON.stringify({
                  message:
                    'According to the API Gateway specs, the body content must be stringified. Check your Lambda response and make sure you are invoking JSON.stringify(YOUR_CONTENT) on your body object',
                }),
                statusCode: 500,
              };

              cb(null, response);
            }
          },
        )
        .toObject();
    });

    test('should return correctly set multiple set-cookie headers', async () => {
      const offline = new OfflineBuilder()
        .addFunctionHTTP(
          'fn1',
          {
            method: 'GET',
            path: 'fn1',
          },
          (event, context, cb) =>
            cb(null, {
              headers: { 'set-cookie': 'foo=bar', 'set-COOKIE': 'floo=baz' },
              statusCode: 200,
            }),
        )
        .toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/fn1',
      });

      expect(res.headers).toHaveProperty('set-cookie');
      expect(res.headers['set-cookie']).toEqual(
        expect.arrayContaining(['foo=bar', 'floo=baz']),
      );
    });
  });

  describe('with the stageVariables plugin', () => {
    test('should handle custom stage variables declaration', async () => {
      const offline = new OfflineBuilder()
        .addCustom('stageVariables', { hello: 'Hello World' })
        .addFunctionHTTP(
          'hello',
          {
            method: 'GET',
            path: 'fn1',
          },
          (event, context, cb) =>
            cb(null, {
              statusCode: 201,
              body: event.stageVariables.hello,
            }),
        )
        .toObject();

      const res = await offline.inject({
        method: 'GET',
        url: '/fn1',
      });

      expect(res.payload).toEqual('Hello World');
    });
  });

  describe('with catch-all route', () => {
    test('should match arbitary route', async () => {
      const offline = new OfflineBuilder()
        .addFunctionHTTP(
          'test',
          {
            method: 'GET',
            path: 'test/{stuff+}',
          },
          (event, context, cb) =>
            cb(null, {
              body: 'Hello',
              statusCode: 200,
            }),
        )
        .toObject();

      const res = await offline.inject('/test/some/matching/route');

      expect(res.statusCode).toEqual(200);
      expect(res.payload).toEqual('Hello');
    });
  });

  describe('does not mangle payload', () => {
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

    beforeEach(() => {
      offline = new OfflineBuilder(new ServerlessBuilder())
        .addFunctionConfig(
          'fn2',
          {
            handler: 'handler.rawJsonBody',
            events: [
              {
                http: {
                  path: 'fn2',
                  method: 'POST',
                },
              },
            ],
          },
          (event, context, cb) => {
            if (event.body === rawBody) {
              const response = {
                body: JSON.stringify({
                  message: 'JSON body was not stripped of newlines or tabs',
                }),
                statusCode: 200,
              };

              cb(null, response);
            } else {
              cb('JSON body was mangled');
            }
          },
        )
        .toObject();
    });

    test('should return that the JSON was not mangled', async () => {
      const res = await offline.inject({
        method: 'POST',
        payload: rawBody,
        url: '/fn2',
      });

      expect(res.statusCode).toEqual(200);
      expect(res.payload).toEqual(
        JSON.stringify({
          message: 'JSON body was not stripped of newlines or tabs',
        }),
      );
    });

    test('should return that the JSON was not mangled with an application/json type', async () => {
      const res = await offline.inject({
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
        payload: rawBody,
        url: '/fn2',
      });

      expect(res.statusCode).toEqual(200);
      expect(res.payload).toEqual(
        JSON.stringify({
          message: 'JSON body was not stripped of newlines or tabs',
        }),
      );
    });
  });

  describe('aws runtime nodejs8.10', () => {
    const serverless = {
      service: {
        provider: {
          name: 'aws',
          region: 'us-east-1',
          runtime: 'nodejs8.10',
          stage: 'dev',
        },
      },
    };

    test('should support handler returning Promise', async () => {
      const offline = new OfflineBuilder(new ServerlessBuilder(serverless))
        .addFunctionHTTP(
          'index',
          {
            method: 'GET',
            path: 'index',
          },
          () =>
            Promise.resolve({
              body: JSON.stringify({ message: 'Hello World' }),
              statusCode: 200,
            }),
        )
        .toObject();

      const res = await offline.inject({
        method: 'GET',
        payload: { data: 'input' },
        url: '/index',
      });

      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.statusCode).toEqual(200);
      expect(res.payload).toEqual('{"message":"Hello World"}');
    });

    test('should support handler returning Promise that defers', async () => {
      const offline = new OfflineBuilder(new ServerlessBuilder(serverless))
        .addFunctionHTTP(
          'index',
          {
            method: 'GET',
            path: 'index',
          },
          () =>
            new Promise((resolve) =>
              setTimeout(
                () =>
                  resolve({
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Hello World' }),
                  }),
                10,
              ),
            ),
        )
        .toObject();

      const res = await offline.inject({
        method: 'GET',
        payload: { data: 'input' },
        url: '/index',
      });

      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.statusCode).toEqual(200);
      expect(res.payload).toEqual('{"message":"Hello World"}');
    });

    test('should support handler that defers and uses done()', async () => {
      const offline = new OfflineBuilder(new ServerlessBuilder(serverless))
        .addFunctionHTTP(
          'index',
          {
            method: 'GET',
            path: 'index',
          },
          (request, context, cb) =>
            setTimeout(
              () =>
                cb(null, {
                  body: JSON.stringify({ message: 'Hello World' }),
                  statusCode: 200,
                }),
              10,
            ),
        )
        .toObject();

      const res = await offline.inject({
        method: 'GET',
        payload: { data: 'input' },
        url: '/index',
      });

      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.statusCode).toEqual(200);
      expect(res.payload).toEqual('{"message":"Hello World"}');
    });

    test('should support handler that throws and uses done()', async () => {
      const offline = new OfflineBuilder(new ServerlessBuilder(serverless))
        .addFunctionHTTP(
          'index',
          {
            method: 'GET',
            path: 'index',
          },
          () => {
            throw new Error('This is an error');
          },
        )
        .toObject();

      const res = await offline.inject({
        method: 'GET',
        payload: { data: 'input' },
        url: '/index',
      });

      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.statusCode).toEqual(200);
    });

    test('should support handler using async function', async () => {
      const offline = new OfflineBuilder(new ServerlessBuilder(serverless))
        .addFunctionHTTP(
          'index',
          {
            method: 'GET',
            path: 'index',
          },
          async () => ({
            body: JSON.stringify({ message: 'Hello World' }),
            statusCode: 200,
          }),
        )
        .toObject();

      const res = await offline.inject({
        method: 'GET',
        payload: { data: 'input' },
        url: '/index',
      });

      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.statusCode).toEqual(200);
      expect(res.payload).toEqual('{"message":"Hello World"}');
    });

    test('should support handler that uses async function that throws', async () => {
      const offline = new OfflineBuilder(new ServerlessBuilder(serverless))
        .addFunctionHTTP(
          'index',
          {
            method: 'GET',
            path: 'index',
          },
          async () => {
            throw new Error('This is an error');
          },
        )
        .toObject();

      const res = await offline.inject({
        method: 'GET',
        payload: { data: 'input' },
        url: '/index',
      });

      expect(res.headers['content-type']).toMatch('application/json');
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('with HEAD support', () => {
    test('should skip HEAD route mapping and return 404 when requested', async () => {
      const offline = new OfflineBuilder()
        .addFunctionHTTP(
          'hello',
          {
            method: 'HEAD',
            path: 'fn1',
          },
          null,
        )
        .toObject();

      const res = await offline.inject({
        method: 'HEAD',
        url: '/fn1',
      });

      expect(res.statusCode).toEqual(404);
    });

    test('should use GET route for HEAD requests, if exists', async () => {
      const offline = new OfflineBuilder()
        .addFunctionHTTP(
          'hello',
          {
            method: 'GET',
            path: 'fn1',
          },
          (event, context, cb) =>
            cb(null, {
              body: null,
              statusCode: 204,
            }),
        )
        .toObject();

      const res = await offline.inject({
        method: 'HEAD',
        url: '/fn1',
      });

      expect(res.statusCode).toEqual(204);
    });
  });

  describe('static headers', () => {
    test('are returned if defined in lambda integration', async () => {
      const offline = new OfflineBuilder()
        .addFunctionConfig(
          'headers',
          {
            events: [
              {
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
              },
            ],
            handler: '',
          },
          (event, context, cb) => cb(null, {}),
        )
        .toObject();

      const res = await offline.inject('/headers');

      expect(res.statusCode).toEqual(200);
      expect(res.headers).toHaveProperty('custom-header-1', 'first value');
      expect(res.headers).toHaveProperty('custom-header-2', 'Second Value');
      expect(res.headers).toHaveProperty('custom-header-3', "third's value");
    });

    test('are not returned if not double-quoted strings in lambda integration', async () => {
      const offline = new OfflineBuilder()
        .addFunctionConfig(
          'headers',
          {
            events: [
              {
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
              },
            ],
            handler: '',
          },
          (event, context, cb) => cb(null, {}),
        )
        .toObject();

      const res = await offline.inject('/headers');

      expect(res.statusCode).toEqual(200);
      expect(res.headers).not.toHaveProperty('custom-header-1');
      expect(res.headers).not.toHaveProperty('custom-header-2');
    });

    test('are not returned if defined in non-lambda integration', async () => {
      const offline = new OfflineBuilder()
        .addFunctionConfig(
          'headers',
          {
            events: [
              {
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
              },
            ],
            handler: '',
          },
          (event, context, cb) => cb(null, {}),
        )
        .toObject();

      const res = await offline.inject('/headers');

      expect(res.statusCode).toEqual(200);
      expect(res.headers).not.toHaveProperty('custom-header-1');
      expect(res.headers).not.toHaveProperty('custom-header-2');
    });
  });

  describe('disable cookie validation', () => {
    test('should return bad reqeust by default if invalid cookies are passed by the request', async () => {
      const offline = new OfflineBuilder()
        .addFunctionHTTP(
          'test',
          {
            method: 'GET',
            path: 'fn1',
          },
          (event, context, cb) => cb(null, {}),
        )
        .toObject();

      const res = await offline.inject({
        headers: {
          Cookie:
            'a.strange.cookie.with.newline.at.the.end=yummie123utuiwi-32432fe3-f3e2e32\n',
        },
        method: 'GET',
        url: '/fn1',
      });

      expect(res.statusCode).toEqual(400);
    });

    test('should return 200 if the "disableCookieValidation"-flag is set', async () => {
      const offline = new OfflineBuilder(new ServerlessBuilder(), {
        disableCookieValidation: true,
      })
        .addFunctionHTTP(
          'test',
          {
            method: 'GET',
            path: 'fn1',
          },
          (event, context, cb) => cb(null, {}),
        )
        .toObject();

      const res = await offline.inject({
        headers: {
          Cookie:
            'a.strange.cookie.with.newline.at.the.end=yummie123utuiwi-32432fe3-f3e2e32\n',
        },
        method: 'GET',
        url: '/fn1',
      });

      expect(res.statusCode).toEqual(200);
    });
  });

  describe('check cookie status', () => {
    test('check for isHttpOnly off', async () => {
      const offline = new OfflineBuilder()
        .addFunctionHTTP(
          'test',
          {
            method: 'GET',
            path: 'fn2',
          },
          (event, context, cb) =>
            cb(null, {
              headers: {
                'Set-Cookie': 'mycookie=123',
              },
            }),
        )
        .toObject();

      const res = await offline.inject({
        headers: {},
        method: 'GET',
        url: '/fn2',
      });

      res.headers['set-cookie'].forEach((v) =>
        expect(v.match(/httponly/i)).toEqual(null),
      );
    });

    test('check for isSecure off', async () => {
      const offline = new OfflineBuilder()
        .addFunctionHTTP(
          'test',
          {
            method: 'GET',
            path: 'fn3',
          },
          (event, context, cb) =>
            cb(null, {
              headers: {
                'Set-Cookie': 'mycookie=123',
              },
            }),
        )
        .toObject();

      const res = await offline.inject({
        headers: {},
        method: 'GET',
        url: '/fn3',
      });

      res.headers['set-cookie'].forEach((v) =>
        expect(v.match(/secure/i)).toEqual(null),
      );
    });

    test('check for isSameSite off', async () => {
      const offline = new OfflineBuilder()
        .addFunctionHTTP(
          'test',
          {
            method: 'GET',
            path: 'fn4',
          },
          (event, context, cb) =>
            cb(null, {
              headers: {
                'Set-Cookie': 'mycookie=123',
              },
            }),
        )
        .toObject();

      const res = await offline.inject({
        headers: {},
        method: 'GET',
        url: '/fn4',
      });

      res.headers['set-cookie'].forEach((v) =>
        expect(v.match(/samesite/i)).toEqual(null),
      );
    });
  });

  describe('with resource routes', () => {
    let serviceBuilder;

    beforeEach(() => {
      serviceBuilder = new ServerlessBuilder();
      serviceBuilder.serverless.service.resources = {
        Resources: {
          EchoProxyResource: {
            Properties: {
              PathPart: 'echo/{proxy+}',
            },
            Type: 'AWS::ApiGateway::Resource',
          },
          EchoProxyMethod: {
            Properties: {
              HttpMethod: 'ANY',
              Integration: {
                IntegrationHttpMethod: 'ANY',
                Type: 'HTTP_PROXY',
                Uri: 'http://mockbin.org/request/{proxy}',
              },
              ResourceId: {
                Ref: 'EchoProxyResource',
              },
            },
            Type: 'AWS::ApiGateway::Method',
          },
        },
      };
    });

    test('proxies query strings', async () => {
      const offline = new OfflineBuilder(serviceBuilder, {
        resourceRoutes: true,
      }).toObject();

      const res = await offline.inject('/echo/foo?bar=baz');
      const result = JSON.parse(res.result);

      expect(result.queryString).toHaveProperty('bar', 'baz');
    });

    describe('disable cookie validation', () => {
      test('should return bad request by default if invalid cookies are passed by the request', async () => {
        const offline = new OfflineBuilder(serviceBuilder, {
          resourceRoutes: true,
        })
          .addFunctionHTTP(
            'test',
            {
              method: 'GET',
              path: 'fn1',
            },
            (event, context, cb) => cb(null, {}),
          )
          .toObject();

        const res = await offline.inject({
          headers: {
            Cookie:
              'a.strange.cookie.with.newline.at.the.end=yummie123utuiwi-32432fe3-f3e2e32\n',
          },
          method: 'GET',
          url: '/fn1',
        });

        expect(res.statusCode).toEqual(400);
      });

      test('should return 200 if the "disableCookieValidation"-flag is set', async () => {
        const offline = new OfflineBuilder(serviceBuilder, {
          resourceRoutes: true,
          disableCookieValidation: true,
        })
          .addFunctionHTTP(
            'test',
            {
              method: 'GET',
              path: 'fn1',
            },
            (event, context, cb) => cb(null, {}),
          )
          .toObject();

        const res = await offline.inject({
          headers: {
            Cookie:
              'a.strange.cookie.with.newline.at.the.end=yummie123utuiwi-32432fe3-f3e2e32\n',
          },
          method: 'GET',
          url: '/fn1',
        });

        expect(res.statusCode).toEqual(200);
      });
    });
  });
});
