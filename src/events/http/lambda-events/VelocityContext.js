import { Buffer } from 'node:buffer'
import { env } from 'node:process'
import jsEscapeString from 'js-string-escape'
import { decodeJwt } from 'jose'
import {
  createUniqueId,
  isPlainObject,
  jsonPath,
  parseHeaders,
} from '../../../utils/index.js'

const { parse, stringify } = JSON
const { assign, entries, fromEntries } = Object

function escapeJavaScript(x) {
  if (typeof x === 'string') {
    return jsEscapeString(x).replaceAll('\\n', '\n') // See #26,
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
export default class VelocityContext {
  #path = null

  #payload = null

  #request = null

  #stage = null

  constructor(request, stage, payload, path) {
    this.#path = path
    this.#payload = payload
    this.#request = request
    this.#stage = stage
  }

  getContext() {
    const path = (x) => jsonPath(this.#payload, x)

    const authPrincipalId =
      this.#request.auth &&
      this.#request.auth.credentials &&
      this.#request.auth.credentials.principalId

    let authorizer =
      this.#request.auth &&
      this.#request.auth.credentials &&
      this.#request.auth.credentials.authorizer

    // NOTE FIXME request.raw.req.rawHeaders can only be null for testing (hapi shot inject())
    const headers = parseHeaders(this.#request.raw.req.rawHeaders || [])

    let token = headers && (headers.Authorization || headers.authorization)

    if (token && token.split(' ')[0] === 'Bearer') {
      ;[, token] = token.split(' ')
    }

    if (!authorizer) authorizer = {}

    authorizer.principalId =
      authPrincipalId ||
      env.PRINCIPAL_ID ||
      'offlineContext_authorizer_principalId' // See #24

    if (token) {
      try {
        assign(authorizer, { claims: decodeJwt(token) })
      } catch {
        // Nothing
      }
    }

    return {
      context: {
        apiId: 'offlineContext_apiId',
        authorizer,
        httpMethod: this.#request.method.toUpperCase(),
        identity: {
          accountId: 'offlineContext_accountId',
          apiKey: 'offlineContext_apiKey',
          apiKeyId: 'offlineContext_apiKeyId',
          caller: 'offlineContext_caller',
          cognitoAuthenticationProvider:
            'offlineContext_cognitoAuthenticationProvider',
          cognitoAuthenticationType: 'offlineContext_cognitoAuthenticationType',
          sourceIp: this.#request.info.remoteAddress,
          user: 'offlineContext_user',
          userAgent: this.#request.headers['user-agent'] || '',
          userArn: 'offlineContext_userArn',
        },
        requestId: createUniqueId(),
        resourceId: 'offlineContext_resourceId',
        resourcePath: this.#path,
        stage: this.#stage,
      },
      input: {
        body: this.#payload, // Not a string yet, todo
        json: (x) => stringify(path(x)),
        params: (x) =>
          typeof x === 'string'
            ? this.#request.params[x] || this.#request.query[x] || headers[x]
            : {
                header: headers,
                path: {
                  ...this.#request.params,
                },
                querystring: {
                  ...this.#request.query,
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
        urlDecode: (x) => decodeURIComponent(x.replaceAll('+', ' ')),
        urlEncode: encodeURI,
      },
    }
  }
}
