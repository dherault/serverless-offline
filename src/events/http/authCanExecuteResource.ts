import authMatchPolicyResource from './authMatchPolicyResource'

const { isArray } = Array

function checkStatementsAgainstResource(
  Statement,
  resource: string,
  effect: string,
) {
  return Statement.some((statement) => {
    const resourceArray = isArray(statement.Resource)
      ? statement.Resource
      : [statement.Resource]

    return (
      statement.Effect.toLowerCase() === effect.toLowerCase() &&
      resourceArray.some((policyResource) =>
        authMatchPolicyResource(policyResource, resource),
      )
    )
  })
}

export default function authCanExecuteResource(policy, resource: string) {
  const { Statement } = policy

  // check for explicit deny
  const denyStatementFound = checkStatementsAgainstResource(
    Statement,
    resource,
    'Deny',
  )

  if (denyStatementFound) {
    return false
  }

  return checkStatementsAgainstResource(Statement, resource, 'Allow')
}
