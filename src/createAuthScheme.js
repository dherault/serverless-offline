'use strict';

const Boom = require('boom');

const createLambdaContext = require('./createLambdaContext');
const functionHelper = require('./functionHelper');
const debugLog = require('./debugLog');

module.exports = function createAuthScheme(fun, options) {
  let populatedFun;
  try {
    populatedFun = fun.toObjectPopulated({
      stage:  options.stage,
      region: options.region,
    });
  } catch (err) {
    debugLog(`Error while populating function '${fun.name}' with stage '${this.options.stage}' and region '${this.options.region}':`);
    throw err;
  }
  const funOptions = functionHelper.getFunctionOptions(fun, populatedFun);

  const lambdaContext = createLambdaContext(fun, (err, data) => {
    if(err) {
      debugLog(`Authorization ${fun.name} returned an error response`, err);
    } else {
      debugLog(`Authorization ${fun.name} returned a successful response`, data);
    }

  });

  const scheme = function (server, options) {

      return {
          authenticate: function (request, reply) {
            debugLog('')
            debugLog(`Running Authorization scheme for ${fun.name}`);

            const req = request.raw.req;
            const authorization = req.headers.authorization;

            debugLog(`Recieved auth header: `, authorization);
            let bearerToken = null;

            if (authorization) {
              const authParts = authorization.split(' ');
              bearerToken = authParts[1];
            }

            const event = {
              "type": "TOKEN",
              "authorizationToken": bearerToken,
              "methodArn": "arn:aws:execute-api:<Region id>:<Account id>:<API id>/<Stage>/<Method>/<Resource path>"
            };

            let handler; // The lambda function

            try {
              handler = functionHelper.createHandler(funOptions, this.options);
            } catch (err) {
              return reply(Boom.badImplementation(null, `Error while loading ${funName}`));
            }

            const x = handler(event, lambdaContext, lambdaContext.done);

            if (!bearerToken) {
                return reply(Boom.unauthorized(null, 'Custom'));
            }

            return reply.continue({ credentials: { } });
          }
      };
  };

  return scheme;
}
