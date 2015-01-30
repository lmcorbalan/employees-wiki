var passport      = module.parent.exports.passport
  , LocalStrategy = require('passport-local').Strategy
  , Users         = require('../models/users.js');

passport.serializeUser( function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use( 'UserLogin', new LocalStrategy(
  { usernameField: 'email'
  , passwordField: 'password'
  },
  function (username, password, done) {
    Users.findOne({ email: username }, function (err, user) {
      if (err)   return done(err);

      if (!user) return done(null, false, { message: 'Email incorrecto' });

      user.authenticate(password, function (err, isMatch) {
        if (err)   return done(err);

        if (isMatch) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'Password incorrecto' });
        }
      })

    });
  }
))
