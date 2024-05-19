/* eslint-disable max-classes-per-file */

"use strict"

const { stringify } = JSON

exports.namespaceFoo = {
  async exportBar() {
    return {
      body: stringify("bar"),
      statusCode: 200,
    }
  },
}

exports.namespaceFoo.namespaceBar = {
  async exportFooBar() {
    return {
      body: stringify("foobar"),
      statusCode: 200,
    }
  },
}

exports.namespaceClassStatic = class Foo {
  static async exportStatic() {
    return {
      body: stringify("static"),
      statusCode: 200,
    }
  }
}

exports.namespaceClassPrototype = new (class Foo {
  async exportPrototype() {
    return {
      body: stringify("prototype"),
      statusCode: 200,
    }
  }
})()
