var app      = module.parent.exports.app
  , passport = module.parent.exports.passport
  , Users    = require('../models/users.js');

var alreadyAdminLoged = function (req, res, next) {
  if ( typeof req.user != "undefined" ) {
    req.flash( 'warning', 'Ya se encuentra logeado' );
    res.redirect( req.user.is_admin ? '/panel' : '/' );
  }

  next()
}


// Login
app.get('/admin', alreadyAdminLoged, function (req, res) {
  res.render('login', { title: 'Login' })
});

app.post('/admin', alreadyAdminLoged, passport.authenticate('UserLogin',
  { successRedirect: '/panel'
  , failureRedirect: '/admin'
  , failureFlash: true
  , successFlash: 'Bienvenido!!'
  }
));


// Logout
app.get('/logout', function (req, res) {
  req.logout();
  req.flash( "info", "Adios!" );
  res.redirect('/admin')
});
