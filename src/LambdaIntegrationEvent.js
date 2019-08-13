'use strict'

const renderVelocityTemplateObject = require('./renderVelocityTemplateObject.js')
const VelocityContext = require('./VelocityContext.js')

module.exports = class LambdaIntegrationEvent {
  constructor(request, velocityContextOptions, requestTemplate) {
    this._payload = request.payload
    this._request = request
    this._requestTemplate = requestTemplate
    this._velocityContextOptions = velocityContextOptions
  }

  getEvent() {
    const velocityContext = new VelocityContext(
      this._request,
      this._velocityContextOptions,
      this._request.payload || {},
    ).getContext()

    const event = renderVelocityTemplateObject(
      this._requestTemplate,
      velocityContext,
    )

    return event
  }
}
