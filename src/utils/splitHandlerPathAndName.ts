// some-folder/src.index => some-folder/src
export default function splitHandlerPathAndName(
  handler: string,
): [string, string] {
  // Split handler into method name and path i.e. handler.run
  // Support nested paths i.e. ./src/somefolder/.handlers/handler.run
  const delimiter = handler.lastIndexOf('.')
  const path = handler.substr(0, delimiter)
  const name = handler.substr(delimiter + 1)

  return [path, name]
}
