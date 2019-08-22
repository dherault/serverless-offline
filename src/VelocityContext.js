'use strict'

const { Buffer } = require('buffer')
const jsEscapeString = require('js-string-escape')
const { decode } = require('jsonwebtoken')
const objectFromEntries = require('object.fromentries')
const jsonPath = require('./jsonPath.js')
const {
  createUniqueId,
  isPlainObject,
  parseHeaders,
} = require('./utils/index.js')

objectFromEntries.shim()

const { parse, stringify } = JSON
const { entries, fromEntries } = Object

function escapeJavaScript(x) {
  if (typeof x === 'string') {
    return jsEscapeString(x).replace(/\\n/g, '\n') // See #26,
  }

  if (isPlainObject(x)) {
    const result = fromEntries(
      entries(x).map(([key, value]) => [key, jsEscapeString(value)]),
    )

    return stringify(result) // Is this really how APIG does it?
  }

  if (typeof x.toString === 'function') {
    return escapeJavaScript(x.toString())
  }

  return x
}

/*
  Returns a context object that mocks APIG mapping template reference
  http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html
*/
module.exports = class VelocityContext {
  constructor(request, stage, payload) {
    this._payload = payload
    this._request = request
    this._stage = stage
  }

  getContext() {
    const path = (x) => jsonPath(this._payload || {}, x)
    const authPrincipalId =
      this._request.auth &&
      this._request.auth.credentials &&
      this._request.auth.credentials.user
    const headers = parseHeaders(this._request.raw.req.rawHeaders || []) // TEMP FIXME || [] for testing

    let token = headers && (headers.Authorization || headers.authorization)

    if (token && token.split(' ')[0] === 'Bearer') {
      ;[, token] = token.split(' ')
    }

    let claims

    if (token) {
      try {
        claims = decode(token) || undefined
      } catch (err) {
        // Nothing
      }
    }

    return {
      context: {
        apiId: 'offlineContext_apiId',
        authorizer: {
          claims,
          principalId:
            authPrincipalId ||
            process.env.PRINCIPAL_ID ||
            'offlineContext_authorizer_principalId', // See #24
        },
        httpMethod: this._request.method.toUpperCase(),
        identity: {
          accountId: 'offlineContext_accountId',
          apiKey: 'offlineContext_apiKey',
          caller: 'offlineContext_caller',
          cognitoAuthenticationProvider:
            'offlineContext_cognitoAuthenticationProvider',
          cognitoAuthenticationType: 'offlineContext_cognitoAuthenticationType',
          sourceIp: this._request.info.remoteAddress,
          user: 'offlineContext_user',
          userAgent: this._request.headers['user-agent'] || '',
          userArn: 'offlineContext_userArn',
        },
        requestId: `offlineContext_requestId_${createUniqueId()}`,
        resourceId: 'offlineContext_resourceId',
        resourcePath: this._request.route.path,
        stage: this._stage,
      },
      input: {
        body: this._payload, // Not a string yet, todo
        json: (x) => stringify(path(x)),
        params: (x) =>
          typeof x === 'string'
            ? this._request.params[x] || this._request.query[x] || headers[x]
            : {
                header: headers,
                path: {
                  ...this._request.params,
                },
                querystring: {
                  ...this._request.query,
                },
              },
        path,
      },
      util: {
        base64Decode: (x) =>
          Buffer.from(x.toString(), 'base64').toString('binary'),
        base64Encode: (x) =>
          Buffer.from(x.toString(), 'binary').toString('base64'),
        escapeJavaScript,
        parseJson: parse,
        urlDecode: (x) => decodeURIComponent(x.replace(/\+/g, ' ')),
        urlEncode: encodeURI,
      },
    }
  }
}
