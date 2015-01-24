var app           = module.parent.exports.app
  , Users         = require( '../models/users.js' );

// Metodo interceptor Passaport
var adminAuth = function (req, res, next) {
  console.log('req.user', req.user)
  //authorized role
  if ( typeof req.user != "undefined" && req.user.is_admin ) {
    next()
  } else {
    //not authorized...redirect
    req.flash( 'error', 'Seccion no autorizada' );
    res.redirect('/')
  }
}

// Login
app.get( '/', function (req, res) {
  res.render('index', { title: 'INDEX'})
})

// Panel
app.get( '/panel', adminAuth, function (req, res) {
  res.redirect('/panel/employees')
  // res.render('index', { title: 'INDEX PANEL'})
})

app.get( '/panel/employees', adminAuth, function (req, res) {
  Users.findEmployees(function (err, employees) {
    res.render( 'employees_list', { title: "Listado de Empleados", employees: employees } )
  })
})
