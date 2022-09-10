package com.serverless

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.lambda.runtime.RequestHandler
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2ProxyRequestEvent
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2ProxyResponseEvent
import groovy.json.JsonOutput
import groovy.transform.CompileStatic
import org.apache.log4j.Logger

@CompileStatic
class Handler implements RequestHandler<APIGatewayV2ProxyRequestEvent, APIGatewayV2ProxyResponseEvent> {

  private static final Logger LOG = Logger.getLogger(Handler.class)

  @CompileStatic
  @Override
  APIGatewayV2ProxyResponseEvent handleRequest(APIGatewayV2ProxyRequestEvent event, Context context) {
    final response = new APIGatewayV2ProxyResponseEvent()
    response.setStatusCode(200)
    response.setBody(JsonOutput.toJson([
      message: 'Go Serverless v1.x! Your function executed successfully!'
    ]))
    return response
  }

}
