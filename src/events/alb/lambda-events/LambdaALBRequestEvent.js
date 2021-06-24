export default class LambdaALBRequestEvent {
  #routeKey = null
  #request = null

  constructor(request) {
    this.#request = request
  }

  create() {
    const { method } = this.#request
    const httpMethod = method.toUpperCase()
    return {
      requestContext: {
        elb: {
          targetGroupArn:
            'arn:aws:elasticloadbalancing:us-east-1:550213415212:targetgroup/5811b5d6aff964cd50efa8596604c4e0/b49d49c443aa999f',
        },
      },
      httpMethod,
      path: this.#request.url.pathname,
      queryStringParameters: this.#request.url.searchParams.toString(),
      headers: this.#request.headers,
      body: this.#request.payload,
      isBase64Encoded: false,
    }
  }
}
