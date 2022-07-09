const { entries } = Object

// Used to resolve Fn::Join in environment variables
export default function resolveJoins(environment) {
  if (!environment) {
    return undefined
  }

  const newEnv = {}

  entries(environment).forEach(([key, value]) => {
    if (!value) {
      return
    }

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
