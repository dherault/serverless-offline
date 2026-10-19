import {
  parseMultiValueHeaders,
  parseMultiValueQueryStringParameters,
} from "../../../utils/index.js"

const { fromEntries } = Object

export default class LambdaAlbRequestEvent {
  #path = null

  #request = null

  constructor(request, path) {
    this.#path = path
    this.#request = request
  }

  create() {
    const { method } = this.#request
    const { rawHeaders, url } = this.#request.raw.req
    const httpMethod = method.toUpperCase()

    const queryStringParameters = this.#request.url.search
      ? fromEntries(Array.from(this.#request.url.searchParams))
      : null

    return {
      body: this.#request.payload,
      headers: this.#request.headers,
      httpMethod,
      isBase64Encoded: false,
      multiValueHeaders: parseMultiValueHeaders(
        // NOTE FIXME request.raw.req.rawHeaders can only be null for testing (hapi shot inject())
        rawHeaders || [],
      ),
      multiValueQueryStringParameters: parseMultiValueQueryStringParameters(url),
      path: this.#path,
      queryStringParameters,
      requestContext: {
        elb: {
          targetGroupArn:
            // TODO: probably replace this
            "arn:aws:elasticloadbalancing:us-east-1:550213415212:targetgroup/5811b5d6aff964cd50efa8596604c4e0/b49d49c443aa999f",
        },
      },
    }
  }
}
