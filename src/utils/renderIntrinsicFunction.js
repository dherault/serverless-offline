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
        // Fn::Sub: String, or Fn::Sub: [String, { Var1Name: Var1Value, ... }]
        const [template, variables = {}] =
          typeof value === "string" ? [value] : value
        return template.replaceAll(/\${(.*?)}/g, (match, variable) => {
          return Object.hasOwn(variables, variable)
            ? variables[variable]
            : match
        })
      }
      result[key] = renderIntrinsicFunction(value)
    }
    return result
  }

  return input
}
