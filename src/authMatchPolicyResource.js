module.exports = (policyResource, resource) => {
  //resource and policyResource are ARNs
  if (policyResource === resource) {
    return true;
  }
  else if (policyResource === '*') {
    return true;
  }
  else if (policyResource === 'arn:aws:execute-api:**') {
    //better fix for #523
    return true;
  }
  else if (policyResource.includes('*')) {
    //Policy contains a wildcard resource

    const parsedPolicyResource = parseResource(policyResource);
    const parsedResource = parseResource(resource);

    if (parsedPolicyResource.region !== '*' && parsedPolicyResource.region !== parsedResource.region) {
      return false;
    }
    if (parsedPolicyResource.accountId !== '*' && parsedPolicyResource.accountId !== parsedResource.accountId) {
      return false;
    }
    if (parsedPolicyResource.restApiId !== '*' && parsedPolicyResource.restApiId !== parsedResource.restApiId) {
      return false;
    }

    //The path contains stage, method and the path
    //for the requested resource and the resource defined in the policy
    const splitPolicyResourceApi = parsedPolicyResource.path.split('/');
    const splitResourceApi = parsedResource.path.split('/');

    return splitPolicyResourceApi.every((resourceFragment, index) => {
      if (splitResourceApi.length >= index + 1) {
        return (splitResourceApi[index] === resourceFragment || resourceFragment === '*');
      }
      //The last position in the policy resource is a '*' it matches all
      //following resource fragments

      return splitPolicyResourceApi[splitPolicyResourceApi.length - 1] === '*';
    });
  }

  return false;
};


function parseResource(resource) {
  const parts = resource.match(/arn:aws:execute-api:(.*?):(.*?):(.*?)\/(.*)/);
  const region = parts[1];
  const accountId = parts[2];
  const restApiId = parts[3];
  const path = parts[4];

  return { region, accountId, restApiId, path };
}
