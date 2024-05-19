import {
  ApiGatewayManagementApi,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi"

const { parse, stringify } = JSON

export async function initiateOneWay(event, context) {
  console.log(
    stringify(
      {
        context,
        event,
      },
      null,
      2,
    ),
  )

  const body = parse(event.body)

  const url = "http://localhost:3001"

  const apigatewaymanagementapi = new ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: url,
  })

  const postToConnectionCommand = new PostToConnectionCommand({
    ConnectionId: event.headers["connection-id"], // connectionId of the receiving ws-client
    Data: new TextEncoder().encode(stringify(body)),
  })

  let data

  try {
    data = await apigatewaymanagementapi.send(postToConnectionCommand)
  } catch (err) {
    console.log("err is", err)
    throw err
  }

  console.log(data)

  return {
    body: stringify({
      status: "Message send.",
    }),
    statusCode: 200,
  }
}

export async function connect(event, context) {
  console.log(
    stringify(
      {
        context,
        event,
      },
      null,
      2,
    ),
  )

  return {
    // body: stringify(
    //   {
    //     context,
    //     event,
    //   },
    //   null,
    //   2,
    // ),
    statusCode: 200,
  }
}

export async function disconnect(event, context) {
  console.log(
    stringify(
      {
        context,
        event,
      },
      null,
      2,
    ),
  )

  return {
    // body: stringify(
    //   {
    //     context,
    //     event,
    //   },
    //   null,
    //   2,
    // ),
    statusCode: 200,
  }
}

// eslint-disable-next-line no-underscore-dangle
export async function defaultRoute(event, context) {
  console.log(
    stringify(
      {
        context,
        event,
      },
      null,
      2,
    ),
  )

  return {
    body: stringify(
      {
        Hello: "World",
      },
      null,
      2,
    ),
    statusCode: 200,
  }
}
