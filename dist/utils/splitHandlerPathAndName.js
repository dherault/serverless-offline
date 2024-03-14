export default function splitHandlerPathAndName(handler) {
  if (handler.match(/::/)) {
    const prepathDelimiter = handler.lastIndexOf('/')
    const prepath = handler.substr(0, prepathDelimiter + 1)
    const postpath = handler.substr(prepathDelimiter + 1)
    const nameDelimiter = postpath.indexOf('.')
    const filename = postpath.substr(0, nameDelimiter)
    const path = prepath + filename
    const name = postpath.substr(nameDelimiter + 1)
    return [path, name]
  }
  const delimiter = handler.lastIndexOf('.')
  const path = handler.substr(0, delimiter)
  const name = handler.substr(delimiter + 1)
  return [path, name]
}
