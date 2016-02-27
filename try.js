const createVelocityContext = require('./createVelocityContext');

const Engine = require('velocity').Engine
const engine = new Engine( {{options}} )
const result = engine.render( {{context}} )
console.log(result)

