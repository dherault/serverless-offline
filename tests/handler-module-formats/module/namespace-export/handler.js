// eslint-disable-next-line max-classes-per-file
const { stringify } = JSON

export * as namespaceFoo from "./handlers.js"

export const namespaceBar = {
  async exportFooBar() {
    return {
      body: stringify("foobar"),
      statusCode: 200,
    }
  },
}

export const namespaceClassStatic = class Foo {
  static async exportStatic() {
    return {
      body: stringify("static"),
      statusCode: 200,
    }
  }
}

export const namespaceClassPrototype = new (class Foo {
  async exportPrototype() {
    return {
      body: stringify("prototype"),
      statusCode: 200,
    }
  }
})()
