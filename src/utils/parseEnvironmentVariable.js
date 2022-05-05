export default function parseEnvironmentVariable(variableName) {
  if (!variableName) {
    throw new Error('Variable missed!')
  }

  if (process.env[variableName]) {
    try {
      return JSON.parse(process.env[variableName])
    } catch (error) {
      console.error(
        `Serverless-offline: Could not parse process.env.${variableName}, make sure it is correct JSON.`,
      )
    }
  }

  return undefined
}
