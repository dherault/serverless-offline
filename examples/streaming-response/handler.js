/// <reference types="aws-lambda" />

/**
 * Example handler demonstrating API Gateway streaming response support
 *
 * To test this example:
 * 1. cd examples/streaming-response
 * 2. npm install or yarn install
 * 3. serverless offline
 * 4. curl http://localhost:3000/dev/stream
 */

// Helper function to create delays
const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

/* eslint-disable no-undef */
export const stream = awslambda.streamifyResponse(
  async (event, responseStream) => {
    // Return http status code 200 and set content type to application/json
    const httpStream = awslambda.HttpResponseStream.from(responseStream, {
      headers: {
        "Content-Type": "text/plain",
        "X-Custom-Header": "streaming-enabled",
      },
      statusCode: 200,
    })

    // Stream json data
    console.log(`Sending first chunk`)
    httpStream.write("Will send more text every second...")
    const delays = Array.from({ length: 5 }, (_, i) => i).map(async (i) => {
      await delay(1000)
      console.log(`Waited 1 seconds, sending more text...`)
      httpStream.write("more text...")
      console.log(`Sent more text...`)
      return i
    })
    await Promise.all(delays)
    httpStream.write("Done!")
    httpStream.end()
  },
)

export const streamJson = awslambda.streamifyResponse(
  async (event, responseStream) => {
    // Return http status code 200 and set content type to application/json
    const httpStream = awslambda.HttpResponseStream.from(responseStream, {
      headers: {
        "Content-Type": "application/json",
        "X-Custom-Header": "streaming-enabled",
      },
      statusCode: 200,
    })

    // Stream json data
    httpStream.write('{"message": "Starting stream...", "data": [')
    const delays = Array.from({ length: 5 }, (_, i) => i).map(async (i) => {
      await delay(1000)
      console.log(`Waited 1 seconds, sending json data...`)
      const chunk = JSON.stringify({
        item: i,
        timestamp: new Date().toISOString(),
      })
      httpStream.write(i === 4 ? chunk : `${chunk},`)
      console.log(`Sent data ${i}`)
      return i
    })
    await Promise.all(delays)
    httpStream.write("]}")
    httpStream.end()
  },
)
/* eslint-enable no-undef */

// Regular non-streaming handler for comparison
export const regular = async () => {
  return {
    body: "Hello from regular API!",
    headers: {
      "Content-Type": "text/plain",
    },
    statusCode: 200,
  }
}
