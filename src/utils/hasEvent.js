const { values } = Object

export default function hasEvent(functionObjs, name) {
  return values(functionObjs).some((functionObj) =>
    functionObj.events.some((event) => event[name] != null),
  )
}
