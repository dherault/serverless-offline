export default class LambdaAlbRequestEvent {
  #request = null

  constructor(request) {
    this.#request = request
  }

  create() {
    const { method } = this.#request
    const httpMethod = method.toUpperCase()

    return {
      body: this.#request.payload,
      headers: this.#request.headers,
      httpMethod,
      isBase64Encoded: false,
      path: this.#request.url.pathname,
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
