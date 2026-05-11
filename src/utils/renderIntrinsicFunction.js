export default function renderIntrinsicFunction(input) {
  if (input === null || input === undefined) {
    return input
  }

  if (typeof input === "string") {
    return input
  }

  if (Array.isArray(input)) {
    return input.map(renderIntrinsicFunction)
  }

  if (typeof input === "object") {
    const result = {}
    for (const [key, value] of Object.entries(input)) {
      if (key === "Fn::Join" || key === "!Join") {
        const [delimiter, list] = value
        return list.map(renderIntrinsicFunction).join(delimiter)
      }
      if (key === "Fn::Sub" || key === "!Sub") {
        const [template, variables] = value
        result[key] = template.replaceAll(/\${(.*?)}/g, (match, variable) => {
          return variable in variables ? variables[variable] : match
        })
        return result[key]
      }
      result[key] = renderIntrinsicFunction(value)
    }
    return result
  }

  return input
}
