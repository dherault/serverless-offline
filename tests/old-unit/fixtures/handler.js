'use strict'

const { stringify } = JSON

exports.basicAuthentication1 = (event, context, cb) => {
  const response = {
    body: stringify({
      message: 'Private Function Executed Correctly',
    }),
    statusCode: 200,
  }
  cb(null, response)
}

exports.basicAuthentication2 = (event, context, cb) => {
  const response = {
    body: stringify({
      message: 'Private Function Executed Correctly',
    }),
    statusCode: 200,
  }
  cb(null, response)
}

exports.usersIndex1 = (event, context, cb) => cb(null, 'Hello World')

exports.usersIndex2 = (event, context, cb) =>
  cb(new Error('Internal Server Error'))

exports.usersIndex3 = (event, context, cb) =>
  cb(new Error('[401] Unauthorized'))

exports.fn1 = (event, context, cb) =>
  cb(null, {
    body: stringify({ data: 'data' }),
    statusCode: 200,
  })

exports.fn2 = (event, context, cb) =>
  cb(null, {
    body: stringify({ data: 'data' }),
    headers: {
      'content-type': 'application/json',
    },
    statusCode: 200,
  })

exports.fn3 = (event, context, cb) =>
  cb(null, {
    body: stringify({ data: 'data' }),
    headers: {
      'content-type': 'application/vnd.api+json',
    },
    statusCode: 200,
  })

exports.fn4 = (event, context, cb) =>
  cb(null, {
    body: stringify({ data: 'data' }),
    statusCode: 200,
  })

exports.fn5 = (event, context, cb) =>
  cb(null, {
    body: null,
    statusCode: 201,
  })

exports.fn6 = (event, context, cb) =>
  cb(null, {
    body: null,
    statusCode: 201,
  })

exports.unstringifiedBody = (event, context, cb) => {
  if (typeof event.body !== 'string') {
    const response = {
      body: stringify({
        message:
          'According to the API Gateway specs, the body content must be stringified. Check your Lambda response and make sure you are invoking stringify(YOUR_CONTENT) on your body object',
      }),
      statusCode: 500,
    }

    cb(null, response)
  }
}

exports.fn7 = (event, context, cb) =>
  cb(null, {
    headers: { 'set-cookie': 'foo=bar', 'set-COOKIE': 'floo=baz' },
    statusCode: 200,
  })

exports.test = (event, context, cb) =>
  cb(null, {
    body: 'Hello',
    statusCode: 200,
  })

const rawBody = `{
\t"type": "notification_event",
\t"app_id": "q8sn4hth",
\t"data": {
\t\t"type": "notification_event_data",
\t\t\t"item": {
\t\t\t\t"type": "ping",
\t\t\t\t"message": "something something interzen"
\t\t\t}
\t\t},
\t"links": {},
\t"id": null,
\t"topic": "ping",
\t"delivery_status": null,
\t"delivery_attempts": 1,
\t"delivered_at": 0,
\t"first_sent_at": 1513466985,
\t"created_at": 1513466985,
\t"self": null
}`

exports.rawJsonBody = (event, context, cb) => {
  if (event.body === rawBody) {
    const response = {
      body: stringify({
        message: 'JSON body was not stripped of newlines or tabs',
      }),
      statusCode: 200,
    }

    cb(null, response)
  } else {
    cb('JSON body was mangled')
  }
}

exports.promise = () =>
  Promise.resolve({
    body: stringify({ message: 'Hello World' }),
    statusCode: 200,
  })

exports.promiseDeferred = () =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          body: stringify({ message: 'Hello World' }),
          statusCode: 200,
        }),
      10,
    ),
  )

exports.doneDeferred = (request, context, cb) =>
  setTimeout(
    () =>
      cb(null, {
        body: stringify({ message: 'Hello World' }),
        statusCode: 200,
      }),
    10,
  )

exports.throwDone = () => {
  throw new Error('This is an error')
}

exports.asyncFunction = async () => ({
  body: stringify({ message: 'Hello World' }),
  statusCode: 200,
})

exports.asyncFunctionThrows = async () => {
  throw new Error('This is an error')
}

exports.fn8 = (event, context, cb) =>
  cb(null, {
    body: null,
    statusCode: 204,
  })

exports.headers = (event, context, cb) => cb(null, {})

exports.cookie = (event, context, cb) => cb(null, {})

exports.fn9 = (event, context, cb) =>
  cb(null, {
    headers: {
      'Set-Cookie': 'mycookie=123',
    },
  })

exports.fn10 = (event, context, cb) =>
  cb(null, {
    headers: {
      'Set-Cookie': 'mycookie=123',
    },
  })

exports.fn11 = (event, context, cb) =>
  cb(null, {
    headers: {
      'Set-Cookie': 'mycookie=123',
    },
  })
