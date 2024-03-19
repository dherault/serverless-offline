const { entries, fromEntries, keys } = Object

const APIGATEWAY_INTEGRATION_TYPE_HTTP_PROXY = "HTTP_PROXY"
const APIGATEWAY_ROOT_ID = "RootResourceId"
const APIGATEWAY_TYPE_METHOD = "AWS::ApiGateway::Method"
const APIGATEWAY_TYPE_RESOURCE = "AWS::ApiGateway::Resource"

function getApiGatewayTemplateObjects(resources) {
  const Resources = resources && resources.Resources

  if (!Resources) {
    return {}
  }

  const methodObjects = []
  const pathObjects = []

  entries(Resources).forEach(([key, value]) => {
    const resourceObj = value || {}
    const keyValuePair = [key, resourceObj]

    const { Type } = resourceObj

    if (Type === APIGATEWAY_TYPE_METHOD) {
      methodObjects.push(keyValuePair)
    } else if (Type === APIGATEWAY_TYPE_RESOURCE) {
      pathObjects.push(keyValuePair)
    }
  })

  return {
    methodObjects: fromEntries(methodObjects),
    pathObjects: fromEntries(pathObjects),
  }
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

function isRoot(resourceId) {
  return resourceId === APIGATEWAY_ROOT_ID
}

function getPathPart(resourceObj) {
  if (!resourceObj || !resourceObj.Properties) {
    return undefined
  }

  return resourceObj.Properties.PathPart
}

function getParentId(resourceObj) {
  if (!resourceObj || !resourceObj.Properties) {
    return undefined
  }
  const parentIdObj = resourceObj.Properties.ParentId || {}

  const { Ref } = parentIdObj
  if (Ref) return Ref

  const getAtt = parentIdObj["Fn::GetAtt"] || []

  return getAtt[1]
}

function getFullPath(pathObjects, resourceId) {
  let currentId = resourceId
  let currentObj
  const arrResourceObjects = []

  while (currentId && !isRoot(currentId)) {
    currentObj = pathObjects[currentId]
    arrResourceObjects.push(currentObj)

    currentId = getParentId(currentObj)
  }

  const arrPath = arrResourceObjects.map(getPathPart).reverse()

  if (arrPath.some((s) => !s)) {
    return undefined
  }

  return `/${arrPath.join("/")}`
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
  if (!methodObj || !methodObj.Properties) {
    return undefined
  }
  if (!methodObj.Properties.ResourceId) {
    return undefined
  }

  return methodObj.Properties.ResourceId.Ref
}

function getHttpMethod(methodObj) {
  if (!methodObj || !methodObj.Properties) {
    return undefined
  }

  return methodObj.Properties.HttpMethod
}

function getIntegrationObj(methodObj) {
  if (!methodObj || !methodObj.Properties) {
    return undefined
  }

  return methodObj.Properties.Integration
}

function constructHapiInterface(pathObjects, methodObjects, methodId) {
  // returns all info necessary so that routes can be added in index.js
  const methodObj = methodObjects[methodId]
  const resourceId = getResourceId(methodObj)
  const Integration = getIntegrationObj(methodObj) || {}
  const pathResource = getFullPath(pathObjects, resourceId)
  const method = getHttpMethod(methodObj)
  // let integrationType;
  let proxyUri

  if (!pathResource) {
    return {}
  }

  if (Integration.Type === APIGATEWAY_INTEGRATION_TYPE_HTTP_PROXY) {
    proxyUri = Integration.Uri
  }

  return {
    isProxy: !!proxyUri,
    method,
    pathResource,
    proxyUri,
  }
}

export default function parseResources(resources) {
  const { methodObjects, pathObjects } = getApiGatewayTemplateObjects(resources)

  return fromEntries(
    keys(methodObjects).map((key) => [
      key,
      constructHapiInterface(pathObjects, methodObjects, key),
    ]),
  )
}
