const { values } = Object

function hasEvent(functionObjs, name) {
  return values(functionObjs).some((functionObj) =>
    functionObj.events.some((event) => event[name] != null),
  )
}

export function hasHttpEvent(functionObjs) {
  return hasEvent(functionObjs, 'http')
}

export function hasWebsocketEvent(functionObjs) {
  return hasEvent(functionObjs, 'websocket')
}
