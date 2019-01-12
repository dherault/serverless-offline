const APIGATEWAY_TYPE_RESOURCE = 'AWS::ApiGateway::Resource';
const APIGATEWAY_TYPE_METHOD = 'AWS::ApiGateway::Method';
const APIGATEWAY_ROOT_ID = 'RootResourceId';
const APIGATEWAY_INTEGRATION_TYPE_HTTP_PROXY = 'HTTP_PROXY';

function getApiGatewayTemplateObjects(resources) {
  const Resources = resources && resources.Resources;
  if (!Resources) return {};

  const pathObjects = {};
  const methodObjects = {};

  for (const k in Resources) {
    const resourceObj = Resources[k] || {};
    const Type = resourceObj.Type;

    if (Type === APIGATEWAY_TYPE_RESOURCE) {
      pathObjects[k] = resourceObj;
    }
    else if (Type === APIGATEWAY_TYPE_METHOD) {
      methodObjects[k] = resourceObj;
    }
  }

  return {
    pathObjects,
    methodObjects,
  };
}

/* Example of a Resource Object
 *  "ApiGatewayResourceFavicon": {
 *    "Type": "AWS::ApiGateway::Resource",
 *    "Properties": {
 *      "ParentId": { "Fn::GetAtt": [ "ApiGatewayRestApi", "RootResourceId" ] },
 *      "PathPart": "favicon.ico",
 *      "RestApiId": { "Ref": "ApiGatewayRestApi" }
 *    }
 *  }
 */

/* Resource Helpers */

function isRoot(resourceId) { return resourceId === APIGATEWAY_ROOT_ID; }

function getPathPart(resourceObj) {
  if (!resourceObj || !resourceObj.Properties) return;

  return resourceObj.Properties.PathPart;
}

function getParentId(resourceObj) {
  if (!resourceObj || !resourceObj.Properties) return;
  const parentIdObj = resourceObj.Properties.ParentId || {};

  const Ref = parentIdObj.Ref;
  if (Ref) return Ref;

  const getAtt = parentIdObj['Fn::GetAtt'] || [];

  return getAtt[1];
}

function getFullPath(pathObjects, resourceId) {
  let currentId = resourceId;
  let currentObj;
  const arrResourceObjects = [];

  while (currentId && !isRoot(currentId)) {
    currentObj = pathObjects[currentId];
    arrResourceObjects.push(currentObj);

    currentId = getParentId(currentObj);
  }

  const arrPath = arrResourceObjects.map(getPathPart).reverse();
  if (arrPath.some(s => !s)) return;

  return `/${arrPath.join('/')}`;
}

/* Example of an HTTP Proxy Method Object
 *  "ApiGatewayResourcePublicAnyProxyMethod": {
 *    "Type": "AWS::ApiGateway::Method",
 *    "Properties": {
 *      "ResourceId": { "Ref": "ApiGatewayResourcePublicAny" },
 *      "RestApiId": { "Ref": "ApiGatewayRestApi" },
 *      "AuthorizationType": "NONE",
 *      "HttpMethod": "GET",
 *      "MethodResponses": [ { "StatusCode": 200 } ],
 *      "RequestParameters": { "method.request.path.proxy": true },
 *      "Integration": {
 *        "Type": "HTTP_PROXY",
 *        "IntegrationHttpMethod": "GET",
 *        "Uri": "https://www.example.com/us-west-2/{proxy}", // Note that ${self:provider.region} is expanded
 *        "IntegrationResponses": [ { "StatusCode": 200 } ],
 *        "RequestParameters": { "integration.request.path.proxy": "method.request.path.proxy" },
 *        "PassthroughBehavior": "WHEN_NO_MATCH"
 *      }
 *    }
 *  }
 */

/* Method Helpers */

function getResourceId(methodObj) {
  if (!methodObj || !methodObj.Properties) return;
  if (!methodObj.Properties.ResourceId) return;

  return methodObj.Properties.ResourceId.Ref;
}

function getHttpMethod(methodObj) {
  if (!methodObj || !methodObj.Properties) return;

  return methodObj.Properties.HttpMethod;
}

function getIntegrationObj(methodObj) {
  if (!methodObj || !methodObj.Properties) return;

  return methodObj.Properties.Integration;
}

function templatePathToHapiPath(path) {
  return path.replace('+', '');
}

function constructHapiInterface(pathObjects, methodObjects, methodId) {
  // returns all info necessary so that routes can be added in index.js
  const methodObj = methodObjects[methodId];
  const resourceId = getResourceId(methodObj);
  const Integration = getIntegrationObj(methodObj) || {};
  const pathResource = getFullPath(pathObjects, resourceId);
  const method = getHttpMethod(methodObj);
  // let integrationType;
  let proxyUri;

  if (!pathResource) return {};

  const path = templatePathToHapiPath(pathResource);

  if (Integration.Type === APIGATEWAY_INTEGRATION_TYPE_HTTP_PROXY) {
    proxyUri = Integration.Uri;
  }

  return {
    path,
    method,
    isProxy: !!proxyUri,
    proxyUri,
    pathResource,
  };
}

module.exports = resources => {
  const intf = getApiGatewayTemplateObjects(resources);
  const pathObjects = intf.pathObjects;
  const methodObjects = intf.methodObjects;
  const result = {};

  for (const methodId in methodObjects) {
    result[methodId] = constructHapiInterface(pathObjects, methodObjects, methodId);
  }

  return result;
};
