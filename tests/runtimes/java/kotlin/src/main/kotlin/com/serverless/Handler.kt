package com.serverless

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2ProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2ProxyResponseEvent
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper

class Handler : RequestHandler<APIGatewayV2ProxyRequestEvent, APIGatewayV2ProxyResponseEvent> {

  private val mapper = jacksonObjectMapper()

  override fun handleRequest(input: APIGatewayV2ProxyRequestEvent?, context: Context): APIGatewayV2ProxyResponseEvent {

    val response = APIGatewayV2ProxyResponseEvent()
    response.statusCode = 200
    response.body = mapper.writeValueAsString(hashMapOf("message" to "Go Serverless v1.x! Your function executed successfully!"))
    return response
  }
}
