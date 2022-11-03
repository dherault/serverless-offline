const { stringify } = JSON

export async function connect(event, context) {
  return {
    body: stringify(
      {
        context,
        event,
      },
      null,
      2,
    ),
    statusCode: 200,
  }
}

export async function disconnect(event, context) {
  return {
    body: stringify(
      {
        context,
        event,
      },
      null,
      2,
    ),
    statusCode: 200,
  }
}

// eslint-disable-next-line no-underscore-dangle
export async function _default(event, context) {
  return {
    body: stringify(
      {
        context,
        event,
      },
      null,
      2,
    ),
    statusCode: 200,
  }
}
