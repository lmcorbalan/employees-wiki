var config = {};

switch (process.env.NODE_ENV) {
  case 'development':
    config = require('./config-dev.json');
    break;
  case 'production':
    config = require('./config-prod.json');
    break;
  case 'test':
    config = require('./config-test.json');
    break;
  default:
    config = require('./config-dev.json');
    process.env.NODE_ENV = 'development';
  break;
}

config.envflag = process.env.NODE_ENV;

module.exports = config;
