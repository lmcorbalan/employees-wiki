var mongoose = require('mongoose');

/**
 * Utils
 */

function connectionStr (url, dbname, dbuser, dbpass) {
  var connStr ='mongodb://';

  if(dbuser != "" || dbpass != "") {
    connStr += dbuser + ':' + dbpass + '@' + url + '/' + dbname;
  } else {
    connStr += url + '/' + dbname;
  }

  return connStr;
};

exports.dbConnection = function( url, dbname, dbuser, dbpass ) {

  var connStr = connectionStr(url, dbname, dbuser, dbpass);

  console.log("Connecting to %s ...\n", connStr);

  return mongoose.connect( connStr, function (err) {
    if (err) {
      console.log('Connection to MongoDB error', err);
      return err;
    } else {
      console.log("Connection to MongoDB successful");
    }
  });
};

exports.dbConnectionString = function( url, dbname, dbuser, dbpass ) {
  return connectionStr(url, dbname, dbuser, dbpass);
};
