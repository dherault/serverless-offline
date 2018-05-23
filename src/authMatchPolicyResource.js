module.exports = (policyResource, resource) => {
  if (policyResource === resource) {
    return true;
  }
  else if (policyResource === '*') {
    return true;
  }
  else if (policyResource.includes('*')) {
    //Policy contains a wildcard resource
    const splitPolicyResource = policyResource.split(':');
    const splitResource = resource.split(':');
    //These variables contain api id, stage, method and the path
    //for the requested resource and the resource defined in the policy
    const splitPolicyResourceApi = splitPolicyResource[5].split('/');
    const splitResourceApi = splitResource[5].split('/');

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
