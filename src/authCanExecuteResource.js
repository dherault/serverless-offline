const authMatchPolicyResource = require('./authMatchPolicyResource');

module.exports = (policy, resource) => {
  const Statement = policy.Statement;

  return Statement.some(statement => {
    if (Array.isArray(statement.Resource)) {
      return statement.Effect === 'Allow'
        && statement.Resource.some(policyResource => (
          authMatchPolicyResource(policyResource, resource)
        ));
    }

    return statement.Effect === 'Allow'
      && authMatchPolicyResource(statement.Resource, resource);
  });
};
