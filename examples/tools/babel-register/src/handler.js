const { stringify } = JSON

export async function hello() {
  return {
    body: stringify({ hello: '@babel/register' }),
    statusCode: 200,
  }
}
