package serverless

import com.amazonaws.services.lambda.runtime.events.{APIGatewayV2ProxyRequestEvent, APIGatewayV2ProxyResponseEvent}
import com.amazonaws.services.lambda.runtime.{Context, RequestHandler}
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.scala.DefaultScalaModule
import com.fasterxml.jackson.module.scala.experimental.ScalaObjectMapper

object JsonUtil {
  val mapper = new ObjectMapper() with ScalaObjectMapper
  mapper.registerModule(DefaultScalaModule)

  def toJson(value: Any): String = {
    mapper.writeValueAsString(value)
  }
}

class Handler extends RequestHandler[APIGatewayV2ProxyRequestEvent, APIGatewayV2ProxyResponseEvent] {

  def handleRequest(input: APIGatewayV2ProxyRequestEvent, context: Context): APIGatewayV2ProxyResponseEvent = {
    val response = new APIGatewayV2ProxyResponseEvent()
    response.setStatusCode(200)
    response.setBody(JsonUtil.toJson(Map("message" -> "Go Serverless v1.0! Your function executed successfully!")))
    response
  }
}
