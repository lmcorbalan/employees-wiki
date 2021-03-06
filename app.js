var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var browserify   = require('browserify-middleware');

var utils        = require('./utils');
var config       = exports.config = require('./config');
var session      = require('express-session')
// var flash        = require('express-flash');
var flash        = require('connect-flash');
var passport     = exports.passport = require('passport');
var params = require('express-params');

/**
* Database Connection
*/
require('./utils/dbconnect');

// DB Fixtures
if (config.fixtures && config.fixtures === "enabled") {
  // Load Fixtures
  require('./fixtures');
}

// Express App
var app = exports.app = express();
params.extend(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/components')));
app.use(session({ secret: config.session.secret, resave: true, saveUninitialized: true }))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//provide browserified versions of all the files in a directory
app.use( '/validate.min.js', browserify(['validate-js']) );

// Connect Flash interceptor
app.use( function(req, res, next) {
  res.locals.user    = req.user;
  var flash = req.flash();
  res.locals.message = ! res.locals.message
    ? flash
    : Object.keys(flash).forEach( function (k) {
      var v = flash[k];
      ! res.locals.message[k]
        ? res.locals.message[k].push(v)
        : res.locals.message[k] = [v]

    } )

  next();
});

require('./auth/local-strategy');

// Routes
require('./routes/auth');
require('./routes/main');

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
