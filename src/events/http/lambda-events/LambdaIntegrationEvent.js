import renderVelocityTemplateObject from './renderVelocityTemplateObject.js'
import VelocityContext from './VelocityContext.js'

export default class LambdaIntegrationEvent {
  #path = null
  #request = null
  #requestTemplate = null
  #stage = null

  constructor(request, stage, requestTemplate, path) {
    this.#path = path
    this.#request = request
    this.#requestTemplate = requestTemplate
    this.#stage = stage
  }

  create() {
    const velocityContext = new VelocityContext(
      this.#request,
      this.#stage,
      this.#request.payload || {},
      this.#path,
    ).getContext()

    const event = renderVelocityTemplateObject(
      this.#requestTemplate,
      velocityContext,
    )

    return event
  }
}
