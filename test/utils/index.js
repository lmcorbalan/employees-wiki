'use strict';

/*
* Modified from https://github.com/elliotf/mocha-mongoose
*/

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';

var config   = require('../../config'),
    mongoose = require('mongoose'),
    utils    = require('../../utils');

var dbConex = exports.dbConex = utils.dbConnection(
  config.db.domain,
  config.db.name,
  config.db.user,
  config.db.pass
);

before(function (done) {
  var clearDB  = require('mocha-mongoose')( utils.dbConnectionString(
    config.db.domain,
    config.db.name,
    config.db.user,
    config.db.pass)
  );

  return done();

});

after(function (done) {
  dbConex.disconnect();
  return done();
});
