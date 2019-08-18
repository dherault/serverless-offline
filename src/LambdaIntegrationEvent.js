'use strict'

const renderVelocityTemplateObject = require('./renderVelocityTemplateObject.js')
const VelocityContext = require('./VelocityContext.js')

module.exports = class LambdaIntegrationEvent {
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
