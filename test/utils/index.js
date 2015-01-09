'use strict';

/*
* Modified from https://github.com/elliotf/mocha-mongoose
*/

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';

var config   = require('../../config'),
    utils    = require('../../utils'),
    mongoose = require('mongoose');
    // should   = require('should');

// module.exports = should;

beforeEach(function (done) {

  function clearDB() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {});
    }
    return done();
  }

  if (mongoose.connection.readyState === 0) {
    var connStr = utils.dbConnectionString(
      config.db.domain,
      config.db.name,
      config.db.user,
      config.db.pass
    );

    mongoose.connect( connStr, function (err) {
      if (err) {
        throw err;
      }
      return clearDB();
    });

  } else {
    return clearDB();
  }
});

afterEach(function (done) {
  mongoose.disconnect();
  return done();
});
