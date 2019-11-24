export default class HttpEventDefinition {
  constructor(rawHttpEventDefinition) {
    let method
    let path
    let rest

    if (typeof rawHttpEventDefinition === 'string') {
      ;[method, path] = rawHttpEventDefinition.split(' ')
    } else {
      ;({ method, path, ...rest } = rawHttpEventDefinition)
    }

    this.method = method
    this.path = path

    Object.assign(this, rest)
  }
}
