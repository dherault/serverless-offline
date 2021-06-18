export default function getHandlerName(functionDefinition) {
  const {
    handler,
    image,
  } = functionDefinition;

  if (handler) {
    return handler;
  }

  const { command } = image;
  if (!command || command.length < 1) {
    throw new Error('Unable to determine handler name. Be sure to include a "command" property when using a docker image as a custom runtime. See https://www.serverless.com/blog/container-support-for-lambda');
  }

  return command[0];
}
