// some-folder/src.index => some-folder/src
export default function splitHandlerPathAndName(handler) {
  // Split handler into method name and path i.e. handler.run
  // Support Ruby paths with namespace resolution operators e.g.
  //  ./src/somefolder/source.LambdaFunctions::Handler.process
  //  prepath: ./src/somefolder/
  //  postpath: source.LambdaFunctions::Handler.process
  //  filename: source
  //  path: ./src/somefolder/source
  //  name: LambdaFunctions::Handler.process
  if (handler.match(/::/)) {
    const prepathDelimiter = handler.lastIndexOf('/')
    const prepath = handler.substr(0, prepathDelimiter + 1) // include '/' for path
    const postpath = handler.substr(prepathDelimiter + 1)
    const nameDelimiter = postpath.indexOf('.')
    const filename = postpath.substr(0, nameDelimiter)
    const path = prepath + filename
    const name = postpath.substr(nameDelimiter + 1)

    return [path, name]
  }

  // Support nested paths i.e. ./src/somefolder/.handlers/handler.run
  //  path: ./src/somefoler/.handlers/handler
  //  name: run
  const delimiter = handler.lastIndexOf('.')
  const path = handler.substr(0, delimiter)
  const name = handler.substr(delimiter + 1)

  return [path, name]
}
