import { nullIfEmpty } from '../../../utils/index.js'

export default class LambdaAlbRequestEvent {
  #path = null

  #request = null

  #stage = null

  constructor(request, stage, path) {
    this.#path = path
    this.#request = request
    this.#stage = stage
  }

  create() {
    const { method, params } = this.#request
    const httpMethod = method.toUpperCase()

    return {
      body: this.#request.payload,
      headers: this.#request.headers,
      httpMethod,
      isBase64Encoded: false,
      path: this.#path,
      pathParameters: nullIfEmpty({ ...params }),
      queryStringParameters: this.#request.url.searchParams.toString(),
      requestContext: {
        elb: {
          targetGroupArn:
            // TODO: probably replace this
            'arn:aws:elasticloadbalancing:us-east-1:550213415212:targetgroup/5811b5d6aff964cd50efa8596604c4e0/b49d49c443aa999f',
        },
      },
    }
  }
}
