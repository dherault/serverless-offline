export const hello = async () => {
  return {
    body: JSON.stringify({
      message: "Go Serverless v4.0! Your function executed successfully!",
    }),
    statusCode: 200,
  }
}
