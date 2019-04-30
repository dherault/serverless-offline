const utils = require('./utils');

function envSetup() {
  if (this.options.noEnvironment) {
    // This evict errors in server when we use aws services like ssm
    const baseEnvironment = {
      AWS_REGION: 'dev',
    };
    if (!process.env.AWS_PROFILE) {
      baseEnvironment.AWS_ACCESS_KEY_ID = 'dev';
      baseEnvironment.AWS_SECRET_ACCESS_KEY = 'dev';
    }

    process.env = Object.assign(baseEnvironment, process.env);
  }
  else {
    Object.assign(
      process.env,
      { AWS_REGION: this.service.provider.region },
      this.service.provider.environment
      // this.service.functions[key].environment,
    );
  }
}

function wsConnect(event, handler) {
  // console.log('connect', req);
  console.log('connect');
  const { ws, req } = event;
  if (handler) {
    const connectionId = utils.randomId();
    this.webSockets[connectionId] = ws;
    Object.assign(process.env, this.originalEnvironment);

    envSetup.call(this);

    const event = {
      requestContext: {
        authorizer: { userId: req.headers.auth },
        connectionId,
        _webSockets: this.webSockets,
      },
    };

    return handler(event, null);
  }
}

function wsDisconnect(event, handler) {
  console.log('disconnect');
  const { ws, req } = event;
  if (handler) {
    let connectionId = null;
    Object.keys(this.webSockets).forEach(key => {
      if (ws === this.webSockets[key]) {
        connectionId = key;
      }
    });
    envSetup.call(this);

    const event = {
      requestContext: {
        authorizer: { userId: req.headers.auth },
        connectionId,
        _webSockets: this.webSockets,
      },
    };

    return handler(event, null).then(res => {
      delete this.webSockets[connectionId];
      
      return res;
    });
  }
}

// Maybe do some routing on a defined key in the body.

function wsDefault(request, h, handler) {
  if (handler) {
    const { ws } = request.websocket();
    let connectionId = null;
    Object.keys(this.webSockets).forEach(key => {
      if (ws === this.webSockets[key]) {
        connectionId = key;
      }
    });

    envSetup.call(this);

    const event = {
      body: request.payload.toString(),
      requestContext: {
        authorizer: { userId: request.headers.auth },
        connectionId,
        _webSockets: this.webSockets,
      },
    };

    return handler(event, null);
  }

}

module.exports = { wsConnect, wsDisconnect, wsDefault };
