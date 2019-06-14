'use strict';

const { validate } = require('jsonschema');

module.exports = {
  getModel(custom, eventHttp, serverlessLog) {
    if (eventHttp.documentation && eventHttp.documentation.requestModels) {
      const modelName = eventHttp.documentation.requestModels['application/json'];
      const models = custom.documentation.models.filter(model => model.name === modelName);
      if (models.length === 1) {
        return models[0];
      }
      serverlessLog(`Warning: can't find '${modelName}' within ${JSON.stringify(eventHttp.documentation.requestModels)}`);
    }

    return null;
  },

  validate(model, body) {
    const result = validate(JSON.parse(body), model.schema);
    if (result.errors.length > 0) {
      throw new Error(`Request body validation failed.\n${result.errors.map(e => e.message).join(',')}`);
    }
  },
};
