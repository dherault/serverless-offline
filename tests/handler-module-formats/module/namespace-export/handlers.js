const { stringify } = JSON

// eslint-disable-next-line import/prefer-default-export
export async function foo() {
  return {
    body: stringify('bar'),
    statusCode: 200,
  }
}

// export async function bar() {
//   return {
//     body: stringify('foobar'),
//     statusCode: 200,
//   }
// }
