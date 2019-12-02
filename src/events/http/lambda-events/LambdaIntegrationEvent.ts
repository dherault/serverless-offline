import renderVelocityTemplateObject from './renderVelocityTemplateObject'
import VelocityContext from './VelocityContext'

export default class LambdaIntegrationEvent {
  private readonly _request: any
  private readonly _requestTemplate: any
  private readonly _stage: string

  constructor(request, stage: string, requestTemplate) {
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
