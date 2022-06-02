import { env } from 'node:process'
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

    this.log = v3Utils.log
    this.v3Utils = v3Utils
  }

  create() {
    if (env.AUTHORIZER) {
      try {
        const authorizerContext = parse(env.AUTHORIZER)
        if (authorizerContext) {
          this.#request.auth = {
            ...this.#request.auth,
            credentials: {
              authorizer: authorizerContext,
            },
          }
        }
      } catch {
        this.log.error(
          'Could not parse process.env.AUTHORIZER, make sure it is correct JSON',
        )
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
