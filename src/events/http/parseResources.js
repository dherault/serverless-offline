const { entries, fromEntries, keys } = Object

const APIGATEWAY_INTEGRATION_TYPE_HTTP_PROXY = 'HTTP_PROXY'
const APIGATEWAY_ROOT_ID = 'RootResourceId'
const APIGATEWAY_TYPE_METHOD = 'AWS::ApiGateway::Method'
const APIGATEWAY_TYPE_RESOURCE = 'AWS::ApiGateway::Resource'
const APIGATEWAY_TYPE_INTEGRATION = 'AWS::ApiGatewayV2::Integration'
const APIGATEWAY_TYPE_ROUTE = 'AWS::ApiGatewayV2::Route'

function getApiGatewayTemplateObjects(resources) {
  const Resources = resources && resources.Resources

  if (!Resources) {
    return {}
  }

  const methodObjects = []
  const pathObjects = []
  const integrationObjects = []
  const routeObjects = []

  entries(Resources).forEach(([key, value]) => {
    const resourceObj = value || {}
    const keyValuePair = [key, resourceObj]

    const { Type } = resourceObj

    if (Type === APIGATEWAY_TYPE_METHOD) {
      methodObjects.push(keyValuePair)
    } else if (Type === APIGATEWAY_TYPE_RESOURCE) {
      pathObjects.push(keyValuePair)
    } else if (Type === APIGATEWAY_TYPE_INTEGRATION) {
      integrationObjects.push(keyValuePair)
    } else if (Type === APIGATEWAY_TYPE_ROUTE) {
      routeObjects.push(keyValuePair)
    }
  })

  return {
    integrationObjects: fromEntries(integrationObjects),
    methodObjects: fromEntries(methodObjects),
    pathObjects: fromEntries(pathObjects),
    routeObjects: fromEntries(routeObjects),
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

  const getAtt = parentIdObj['Fn::GetAtt'] || []

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

  return `/${arrPath.join('/')}`
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

function parseJoin(attribute) {
  if (typeof attribute !== 'object' || !attribute['Fn::Join']) return attribute
  const [glue, elements] = attribute['Fn::Join']
  return elements.join(glue)
}

function getIntegrationId(routeObject) {
  if (
    !routeObject ||
    !routeObject.Properties ||
    !routeObject.Properties.Target
  ) {
    return undefined
  }

  const target = routeObject.Properties.Target
  if (target['Fn::Join']) {
    const join = target['Fn::Join']
    const elements = join.length === 2 ? join[1] : []
    const targetRef = elements.find((el) => el.Ref)
    if (typeof targetRef !== 'object') return targetRef
    return targetRef.Ref
  }
  return target.Ref || target
}

function getIntegrationType(Integration) {
  if (!Integration || !Integration.Properties) return undefined
  return Integration.Properties.IntegrationType
}

function constructHapiInterfaceV2(integrationObjects, routeObjects, routeId) {
  // returns all info necessary so that routes can be added in index.js
  const routeObject = routeObjects[routeId]
  const integrationId = getIntegrationId(routeObject)
  const Integration = integrationObjects[integrationId] || {}
  const integrationType = getIntegrationType(Integration)

  let proxyUri
  if (integrationType === APIGATEWAY_INTEGRATION_TYPE_HTTP_PROXY) {
    proxyUri = parseJoin(Integration.Properties.IntegrationUri)
  }

  const routeKey = routeObject.Properties.RouteKey
  const [method, pathResource] = routeKey.split(' ')

  return {
    isProxy: !!proxyUri,
    method,
    pathResource,
    proxyUri,
  }
}

export default function parseResources(resources) {
  const { methodObjects, pathObjects, integrationObjects, routeObjects } =
    getApiGatewayTemplateObjects(resources)

  const restApiResources = keys(methodObjects).map((key) => [
    key,
    constructHapiInterface(pathObjects, methodObjects, key),
  ])
  const httpApiResources = keys(routeObjects).map((key) => [
    key,
    constructHapiInterfaceV2(integrationObjects, routeObjects, key),
  ])
  return fromEntries([...restApiResources, ...httpApiResources])
}
