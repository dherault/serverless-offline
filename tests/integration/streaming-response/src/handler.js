/// <reference types="aws-lambda" />

/* eslint-disable no-undef */
export const streamText = awslambda.streamifyResponse(
  async (event, responseStream) => {
    responseStream.setContentType("text/plain")
    responseStream.write("Hello ")
    responseStream.write("streaming ")
    responseStream.write("world!")
    responseStream.end()
  },
)

export const streamJson = awslambda.streamifyResponse(
  async (event, responseStream) => {
    responseStream.setContentType("application/json")
    responseStream.write('{"message":"')
    responseStream.write("Streaming ")
    responseStream.write("JSON")
    responseStream.write('"}')
    responseStream.end()
  },
)
/* eslint-enable no-undef */

export const regularResponse = async () => {
  return {
    body: "Regular response",
    headers: {
      "Content-Type": "text/plain",
    },
    statusCode: 200,
  }
}

export const streamBuffered = async () => {
  return {
    body: "Buffered response",
    headers: {
      "Content-Type": "text/plain",
    },
    statusCode: 200,
  }
}
