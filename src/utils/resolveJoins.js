// Used to resolve Fn::Join in environment variables
export default function resolveJoins(environment) {
  const newEnv = {}

  Object.keys(environment).forEach((key) => {
    const value = environment[key]
    const joinArray = value['Fn::Join']
    const isJoin = Boolean(joinArray)

    if (isJoin) {
      const separator = joinArray[0]
      const joined = joinArray[1].join(separator)
      newEnv[key] = joined
    } else {
      newEnv[key] = value
    }
  })

  return newEnv
}
