'use strict'

const { values } = Object

function hasEvent(functionObjs, name) {
  return values(functionObjs).some((functionObj) =>
    functionObj.events.some((event) => event[name] != null),
  )
}

exports.hasHttpEvent = function hasHttpEvent(functionObjs) {
  return hasEvent(functionObjs, 'http')
}

exports.hasWebsocketEvent = function hasWebsocketEvent(functionObjs) {
  return hasEvent(functionObjs, 'websocket')
}
