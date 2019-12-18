import OfflineBuilder from './support/OfflineBuilder.js'
import ServerlessBuilder from './support/ServerlessBuilder.js'

const { parse, stringify } = JSON

describe('Offline', () => {
  describe('with a non existing route', () => {
    let offline

    beforeEach(async () => {
      // Creates offline test server with no function
      offline = await new OfflineBuilder(new ServerlessBuilder()).toObject()
    })

    test('should return 404 status code', async () => {
      const res = await offline.inject({
        method: 'GET',
        url: '/dev/magic',
      })

      expect(res.statusCode).toEqual(404)
    })
  })

  describe('with private function', () => {
    let offline
    const validToken = 'valid-token'

    beforeEach(async () => {
      offline = await new OfflineBuilder(new ServerlessBuilder(), {
        apiKey: validToken,
      })
        .addFunctionConfig('fn2', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'fn2',
                private: true,
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.basicAuthentication1',
        })
        .addApiKeys(['token'])
        .toObject()
    })

    test('should return bad request with no token', async () => {
      const res = await offline.inject({
        method: 'GET',
        url: '/dev/fn2',
      })

      expect(res.statusCode).toEqual(403)
      expect(res.payload).toEqual(stringify({ message: 'Forbidden' }))
      expect(res.headers).toHaveProperty(
        'x-amzn-errortype',
        'ForbiddenException',
      )
    })

    test('should return forbidden if token is wrong', async () => {
      const res = await offline.inject({
        headers: { 'x-api-key': 'random string' },
        method: 'GET',
        url: '/dev/fn2',
      })

      expect(res.statusCode).toEqual(403)
      expect(res.payload).toEqual(stringify({ message: 'Forbidden' }))
      expect(res.headers).toHaveProperty(
        'x-amzn-errortype',
        'ForbiddenException',
      )
    })

    test('should return the function executed correctly', async () => {
      const res = await offline.inject({
        headers: { 'x-api-key': validToken },
        method: 'GET',
        url: '/dev/fn2',
      })

      expect(res.statusCode).toEqual(200)
      expect(res.payload).toEqual(
        stringify({ message: 'Private Function Executed Correctly' }),
      )
    })
  })

  describe('with private function and noAuth option set', () => {
    let offline
    const validToken = 'valid-token'

    beforeEach(async () => {
      offline = await new OfflineBuilder(new ServerlessBuilder(), {
        apiKey: validToken,
        noAuth: true,
      })
        .addFunctionConfig('fn2', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'fn3',
                private: true,
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.basicAuthentication2',
        })
        .addApiKeys(['token'])
        .toObject()
    })

    test('should execute the function correctly if no API key is provided', async () => {
      const res = await offline.inject({
        method: 'GET',
        url: '/dev/fn3',
      })

      expect(res.statusCode).toEqual(200)
    })

    test('should execute the function correctly if API key is provided', async () => {
      const res = await offline.inject({
        headers: { 'x-api-key': validToken },
        method: 'GET',
        url: '/dev/fn3',
      })

      expect(res.statusCode).toEqual(200)
    })
  })

  describe('lambda integration', () => {
    test('should use event defined response template and headers', async () => {
      const offline = await new OfflineBuilder()
        .addFunctionConfig('index', {
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
          handler: 'tests/old-unit/fixtures/handler.usersIndex1',
        })
        .toObject()

      const res = await offline.inject('/dev/index')

      expect(res.headers['content-type']).toMatch('text/html')
      expect(res.statusCode).toEqual(200)
    })

    describe('error handling', () => {
      test('should set the status code to 502 when no [xxx] is present', async () => {
        const offline = await new OfflineBuilder()
          .addFunctionConfig('index', {
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
            handler: 'tests/old-unit/fixtures/handler.usersIndex2',
          })
          .toObject()

        const res = await offline.inject('/dev/index')

        expect(res.headers['content-type']).toMatch('text/html')
        expect(res.statusCode).toEqual(502 || '502')
      })

      test('should set the status code to 401 when [401] is the prefix of the error message', async () => {
        const offline = await new OfflineBuilder()
          .addFunctionConfig('index', {
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
            handler: 'tests/old-unit/fixtures/handler.usersIndex3',
          })
          .toObject()

        const res = await offline.inject('/dev/index')

        expect(res.headers['content-type']).toMatch('text/html')
        expect(res.statusCode).toEqual(401 || '401')
      })
    })
  })

  describe('lambda-proxy integration', () => {
    test('should accept and return application/json content type by default', async () => {
      const offline = await new OfflineBuilder()
        .addFunctionConfig('fn1', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'fn1',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.fn1',
        })
        .toObject()

      const res = await offline.inject({
        method: 'GET',
        payload: { data: 'data' },
        url: '/dev/fn1',
      })

      expect(res.headers['content-type']).toMatch('application/json')
    })

    test('should accept and return application/json content type', async () => {
      const offline = await new OfflineBuilder()
        .addFunctionConfig('fn2', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'fn2',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.fn2',
        })
        .toObject()

      const res = await offline.inject({
        headers: {
          'content-type': 'application/json',
        },
        method: 'GET',
        payload: { data: 'data' },
        url: '/dev/fn1',
      })

      expect(res.headers['content-type']).toMatch('application/json')
    })

    test('should accept and return custom content type', async () => {
      const offline = await new OfflineBuilder()
        .addFunctionConfig('fn3', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'fn3',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.fn3',
        })
        .toObject()

      const res = await offline.inject({
        headers: {
          'content-type': 'application/vnd.api+json',
        },
        method: 'GET',
        payload: { data: 'data' },
        url: '/dev/fn3',
      })

      expect(res.headers).toHaveProperty(
        'content-type',
        'application/vnd.api+json',
      )
    })

    test('should return application/json content type by default', async () => {
      const offline = await new OfflineBuilder()
        .addFunctionConfig('fn4', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'fn4',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.fn4',
        })
        .toObject()

      const res = await offline.inject({
        method: 'GET',
        url: '/dev/fn4',
      })

      expect(res.headers['content-type']).toMatch('application/json')
    })

    test('should work with trailing slashes path', async () => {
      const offline = await new OfflineBuilder()
        .addFunctionConfig('fn5', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'fn5',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.fn5',
        })
        .toObject()

      const res = await offline.inject({
        method: 'GET',
        url: '/dev/fn5',
      })

      expect(res.statusCode).toEqual(201)
    })

    test('should return the expected status code', async () => {
      const offline = await new OfflineBuilder()
        .addFunctionConfig('fn6', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'fn6',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.fn6',
        })
        .toObject()

      const res = await offline.inject({
        method: 'GET',
        url: '/dev/fn6',
      })

      expect(res.statusCode).toEqual(201)
    })

    // TODO FIXME this test does not do anything, assertion missing
    test('should return that the body was not stringified', async () => {
      await new OfflineBuilder(new ServerlessBuilder())
        .addFunctionConfig('unstrigifiedBody', {
          events: [
            {
              http: {
                method: 'POST',
                path: 'unstrigifiedBody',
                payload: { data: 'data' },
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.unstringifiedBody',
        })
        .toObject()
    })

    test('should return correctly set multiple set-cookie headers', async () => {
      const offline = await new OfflineBuilder()
        .addFunctionConfig('fn7', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'fn7',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.fn7',
        })
        .toObject()

      const res = await offline.inject({
        method: 'GET',
        url: '/dev/fn7',
      })

      expect(res.headers).toHaveProperty('set-cookie')
      expect(res.headers['set-cookie']).toEqual(
        expect.arrayContaining(['foo=bar', 'floo=baz']),
      )
    })
  })

  describe('with catch-all route', () => {
    test('should match arbitary route', async () => {
      const offline = await new OfflineBuilder()
        .addFunctionConfig('test', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'test/{stuff+}',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.test',
        })
        .toObject()

      const res = await offline.inject('/dev/test/some/matching/route')

      expect(res.statusCode).toEqual(200)
      expect(res.payload).toEqual('Hello')
    })
  })

  describe('does not mangle payload', () => {
    let offline

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
}`

    beforeEach(async () => {
      offline = await new OfflineBuilder(new ServerlessBuilder())
        .addFunctionConfig('rawJsonBody', {
          events: [
            {
              http: {
                method: 'POST',
                path: 'raw-json-body',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.rawJsonBody',
        })
        .toObject()
    })

    test('should return that the JSON was not mangled', async () => {
      const res = await offline.inject({
        method: 'POST',
        payload: rawBody,
        url: '/dev/raw-json-body',
      })

      expect(res.statusCode).toEqual(200)
      expect(res.payload).toEqual(
        stringify({
          message: 'JSON body was not stripped of newlines or tabs',
        }),
      )
    })

    test('should return that the JSON was not mangled with an application/json type', async () => {
      const res = await offline.inject({
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
        payload: rawBody,
        url: '/dev/raw-json-body',
      })

      expect(res.statusCode).toEqual(200)
      expect(res.payload).toEqual(
        stringify({
          message: 'JSON body was not stripped of newlines or tabs',
        }),
      )
    })
  })

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
    }

    test('should support handler returning Promise', async () => {
      const offline = await new OfflineBuilder(
        new ServerlessBuilder(serverless),
      )
        .addFunctionConfig('promise', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'promise',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.promise',
        })
        .toObject()

      const res = await offline.inject({
        method: 'GET',
        payload: { data: 'input' },
        url: '/dev/promise',
      })

      expect(res.headers['content-type']).toMatch('application/json')
      expect(res.statusCode).toEqual(200)
      expect(res.payload).toEqual('{"message":"Hello World"}')
    })

    test('should support handler returning Promise that defers', async () => {
      const offline = await new OfflineBuilder(
        new ServerlessBuilder(serverless),
      )
        .addFunctionConfig('promiseDeferred', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'promise-deferred',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.promiseDeferred',
        })
        .toObject()

      const res = await offline.inject({
        method: 'GET',
        payload: { data: 'input' },
        url: '/dev/promise-deferred',
      })

      expect(res.headers['content-type']).toMatch('application/json')
      expect(res.statusCode).toEqual(200)
      expect(res.payload).toEqual('{"message":"Hello World"}')
    })

    test('should support handler that defers and uses done()', async () => {
      const offline = await new OfflineBuilder(
        new ServerlessBuilder(serverless),
      )
        .addFunctionConfig('doneDeferred', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'done-deferred',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.doneDeferred',
        })
        .toObject()

      const res = await offline.inject({
        method: 'GET',
        payload: { data: 'input' },
        url: '/dev/done-deferred',
      })

      expect(res.headers['content-type']).toMatch('application/json')
      expect(res.statusCode).toEqual(200)
      expect(res.payload).toEqual('{"message":"Hello World"}')
    })

    test('should support handler that throws and uses done()', async () => {
      const offline = await new OfflineBuilder(
        new ServerlessBuilder(serverless),
      )
        .addFunctionConfig('throwDone', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'throw-done',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.throwDone',
        })
        .toObject()

      const res = await offline.inject({
        method: 'GET',
        payload: { data: 'input' },
        url: '/dev/throw-done',
      })

      expect(res.headers['content-type']).toMatch('application/json')
      expect(res.statusCode).toEqual(502)
    })

    test('should support handler using async function', async () => {
      const offline = await new OfflineBuilder(
        new ServerlessBuilder(serverless),
      )
        .addFunctionConfig('asyncFunction', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'async-function',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.asyncFunction',
        })
        .toObject()

      const res = await offline.inject({
        method: 'GET',
        payload: { data: 'input' },
        url: '/dev/async-function',
      })

      expect(res.headers['content-type']).toMatch('application/json')
      expect(res.statusCode).toEqual(200)
      expect(res.payload).toEqual('{"message":"Hello World"}')
    })

    test('should support handler that uses async function that throws', async () => {
      const offline = await new OfflineBuilder(
        new ServerlessBuilder(serverless),
      )
        .addFunctionConfig('asyncFunctionThrows', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'async-function-throws',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.asyncFunctionThrows',
        })
        .toObject()

      const res = await offline.inject({
        method: 'GET',
        payload: { data: 'input' },
        url: '/dev/async-function-throws',
      })

      expect(res.headers['content-type']).toMatch('application/json')
      expect(res.statusCode).toEqual(502)
    })
  })

  describe('with HEAD support', () => {
    test('should skip HEAD route mapping and return 404 when requested', async () => {
      const offline = await new OfflineBuilder()
        .addFunctionConfig('foo', {
          events: [
            {
              http: {
                method: 'HEAD',
                path: 'fn8',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.foo',
        })
        .toObject()

      const res = await offline.inject({
        method: 'HEAD',
        url: '/dev/foo',
      })

      expect(res.statusCode).toEqual(404)
    })

    test('should use GET route for HEAD requests, if exists', async () => {
      const offline = await new OfflineBuilder()
        .addFunctionConfig('fn8', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'fn8',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.fn8',
        })
        .toObject()

      const res = await offline.inject({
        method: 'HEAD',
        url: '/dev/fn8',
      })

      expect(res.statusCode).toEqual(204)
    })
  })

  describe('static headers', () => {
    test('are returned if defined in lambda integration', async () => {
      const offline = await new OfflineBuilder()
        .addFunctionConfig('headers', {
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
          handler: 'tests/old-unit/fixtures/handler.headers',
        })
        .toObject()

      const res = await offline.inject('/dev/headers')

      expect(res.statusCode).toEqual(200)
      expect(res.headers).toHaveProperty('custom-header-1', 'first value')
      expect(res.headers).toHaveProperty('custom-header-2', 'Second Value')
      expect(res.headers).toHaveProperty('custom-header-3', "third's value")
    })

    test('are not returned if not double-quoted strings in lambda integration', async () => {
      const offline = await new OfflineBuilder()
        .addFunctionConfig('headers', {
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
          handler: 'tests/old-unit/fixtures/handler.headers',
        })
        .toObject()

      const res = await offline.inject('/dev/headers')

      expect(res.statusCode).toEqual(200)
      expect(res.headers).not.toHaveProperty('custom-header-1')
      expect(res.headers).not.toHaveProperty('custom-header-2')
    })

    test('are not returned if defined in non-lambda integration', async () => {
      const offline = await new OfflineBuilder()
        .addFunctionConfig('headers', {
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
          handler: 'tests/old-unit/fixtures/handler.headers',
        })
        .toObject()

      const res = await offline.inject('/dev/headers')

      expect(res.statusCode).toEqual(200)
      expect(res.headers).not.toHaveProperty('custom-header-1')
      expect(res.headers).not.toHaveProperty('custom-header-2')
    })
  })

  describe('disable cookie validation', () => {
    test('should return bad reqeust by default if invalid cookies are passed by the request', async () => {
      const offline = await new OfflineBuilder()
        .addFunctionConfig('cookie', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'cookie',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.cookie',
        })
        .toObject()

      const res = await offline.inject({
        headers: {
          Cookie:
            'a.strange.cookie.with.newline.at.the.end=yummie123utuiwi-32432fe3-f3e2e32\n',
        },
        method: 'GET',
        url: '/dev/cookie',
      })

      expect(res.statusCode).toEqual(400)
    })

    test('should return 200 if the "disableCookieValidation"-flag is set', async () => {
      const offline = await new OfflineBuilder(new ServerlessBuilder(), {
        disableCookieValidation: true,
      })
        .addFunctionConfig('cookie', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'cookie',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.cookie',
        })
        .toObject()

      const res = await offline.inject({
        headers: {
          Cookie:
            'a.strange.cookie.with.newline.at.the.end=yummie123utuiwi-32432fe3-f3e2e32\n',
        },
        method: 'GET',
        url: '/dev/cookie',
      })

      expect(res.statusCode).toEqual(200)
    })
  })

  describe('check cookie status', () => {
    test('check for isHttpOnly off', async () => {
      const offline = await new OfflineBuilder()
        .addFunctionConfig('fn9', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'fn9',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.fn9',
        })
        .toObject()

      const res = await offline.inject({
        headers: {},
        method: 'GET',
        url: '/dev/fn9',
      })

      res.headers['set-cookie'].forEach((v) =>
        expect(v.match(/httponly/i)).toEqual(null),
      )
    })

    test('check for isSecure off', async () => {
      const offline = await new OfflineBuilder()
        .addFunctionConfig('fn10', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'fn10',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.fn10',
        })
        .toObject()

      const res = await offline.inject({
        headers: {},
        method: 'GET',
        url: '/dev/fn10',
      })

      res.headers['set-cookie'].forEach((v) =>
        expect(v.match(/secure/i)).toEqual(null),
      )
    })

    test('check for isSameSite off', async () => {
      const offline = await new OfflineBuilder()
        .addFunctionConfig('fn11', {
          events: [
            {
              http: {
                method: 'GET',
                path: 'fn11',
              },
            },
          ],
          handler: 'tests/old-unit/fixtures/handler.fn11',
        })
        .toObject()

      const res = await offline.inject({
        headers: {},
        method: 'GET',
        url: '/dev/fn11',
      })

      res.headers['set-cookie'].forEach((v) =>
        expect(v.match(/samesite/i)).toEqual(null),
      )
    })
  })

  describe('with resource routes', () => {
    let serviceBuilder

    beforeEach(() => {
      serviceBuilder = new ServerlessBuilder()
      serviceBuilder.serverless.service.resources = {
        Resources: {
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
          EchoProxyResource: {
            Properties: {
              PathPart: 'echo/{proxy+}',
            },
            Type: 'AWS::ApiGateway::Resource',
          },
        },
      }
    })

    test('proxies query strings', async () => {
      const offline = await new OfflineBuilder(serviceBuilder, {
        resourceRoutes: true,
      }).toObject()

      const res = await offline.inject('/dev/echo/foo?bar=baz')
      const result = parse(res.result)

      expect(result.queryString).toHaveProperty('bar', 'baz')
    })
  })
})
