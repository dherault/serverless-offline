'use strict';

const authMatchPolicyResource = require('./authMatchPolicyResource');

module.exports = (policy, resource) => {
  const { Statement } = policy;

  // check for explicit deny
  const denyStatementFound = checkStatementsAgainstResource(Statement, resource, 'Deny');
  if (denyStatementFound) {
    return false;
  }

  return checkStatementsAgainstResource(Statement, resource, 'Allow');
};

function checkStatementsAgainstResource(Statement, resource, effect) {
  return Statement.some(statement => {
    const resourceArray = Array.isArray(statement.Resource) ? statement.Resource : [statement.Resource];

    return statement.Effect.toLowerCase() === effect.toLowerCase()
      && resourceArray.some(policyResource => (
        authMatchPolicyResource(policyResource, resource)
      ));
  });
}
