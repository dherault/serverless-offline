const { stringify } = JSON

export async function connect() {
  return {
    body: stringify({
      foo: 'bar',
    }),
    statusCode: 200,
  }
}

export async function disconnect() {
  return {
    body: stringify({
      foo: 'bar',
    }),
    statusCode: 200,
  }
}

// eslint-disable-next-line no-underscore-dangle
export async function _default() {
  return {
    body: stringify({
      foo: 'bar',
    }),
    statusCode: 200,
  }
}
