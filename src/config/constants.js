// dummy placeholder url for the WHATWG URL constructor
// https://github.com/nodejs/node/issues/12682
export const BASE_URL_PLACEHOLDER = 'http://example'

export const CUSTOM_OPTION = 'serverless-offline'

export const DEFAULT_LAMBDA_RUNTIME = 'nodejs14.x'

// https://docs.aws.amazon.com/lambda/latest/dg/limits.html
export const DEFAULT_LAMBDA_MEMORY_SIZE = 1024
// default function timeout in seconds
export const DEFAULT_LAMBDA_TIMEOUT = 6 // 6 seconds

// timeout for all connections to be closed
export const SERVER_SHUTDOWN_TIMEOUT = 5000

export const DEFAULT_WEBSOCKETS_API_ROUTE_SELECTION_EXPRESSION =
  '$request.body.action'

export const DEFAULT_WEBSOCKETS_ROUTE = '$default'

export const DEFAULT_DOCKER_CONTAINER_PORT = 9001
