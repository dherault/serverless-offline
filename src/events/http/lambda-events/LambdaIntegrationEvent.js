import renderVelocityTemplateObject from './renderVelocityTemplateObject.js'
import VelocityContext from './VelocityContext.js'

export default class LambdaIntegrationEvent {
  constructor(request, stage, requestTemplate) {
    this._request = request
    this._requestTemplate = requestTemplate
    this._stage = stage
  }

  create() {
    const velocityContext = new VelocityContext(
      this._request,
      this._stage,
      this._request.payload || {},
    ).getContext()

    const event = renderVelocityTemplateObject(
      this._requestTemplate,
      velocityContext,
    )

    return event
  }
}
