import renderVelocityTemplateObject from './renderVelocityTemplateObject.js'
import VelocityContext from './VelocityContext.js'

const { parse } = JSON

export default class LambdaIntegrationEvent {
  #path = null
  #request = null
  #requestTemplate = null
  #stage = null

  constructor(request, stage, requestTemplate, path, v3Utils) {
    this.#path = path
    this.#request = request
    this.#requestTemplate = requestTemplate
    this.#stage = stage
    this.v3Utils = v3Utils
  }

  create() {
    if (process.env.AUTHORIZER) {
      try {
        const authorizerContext = parse(process.env.AUTHORIZER)
        if (authorizerContext) {
          this.#request.auth = {
            ...this.#request.auth,
            authorizer: authorizerContext,
          }
        }
      } catch (error) {
        if (this.log) {
          this.log.error(
            'Could not parse process.env.AUTHORIZER, make sure it is correct JSON',
          )
        } else {
          console.error(
            'Serverless-offline: Could not parse process.env.AUTHORIZER, make sure it is correct JSON.',
          )
        }
      }
    }

    const velocityContext = new VelocityContext(
      this.#request,
      this.#stage,
      this.#request.payload || {},
      this.#path,
    ).getContext()

    const event = renderVelocityTemplateObject(
      this.#requestTemplate,
      velocityContext,
      this.v3Utils,
    )

    return event
  }
}
