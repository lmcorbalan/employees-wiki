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
    res.redirect('/admin')
  }
}

/****** Panel ********/

// Listar
app.get( '/panel', adminAuth, function (req, res) {
  res.redirect('/panel/employees')
})

app.get( '/panel/employees', adminAuth, function (req, res) {
  Users.findEmployees({}, function (err, employees) {
    res.render( 'employees_list', { title: "Listado de Empleados", employees: employees } )
  })
})

// Crear
app.get( '/panel/employees/new', adminAuth, function (req, res) {
  res.render('employees_new', { title: "Nuevo Empleado" })
});

app.post( '/panel/employees/new', adminAuth, function (req, res) {
  var data = { name      : req.body.name
             , last_name : req.body.last_name
             , email     : req.body.email
             , password  : req.body.password
             , is_admin  : false
             };

  Users.create( data, function (err, doc) {

    if (!err) {
      req.flash( "info", "El nuevo empleado se ha creado correctamente" );
      res.redirect( '/panel/employees' );
    } else {
      data.errors = typeof err.errors !== 'undefined' ? JSON.stringify(err.errors) : 'undefined';
      req.flash( "error", "Ha ocurrido un error al intentar crear el empleado!" );
      res.render('employees_new', { title: "Nuevo Empleado", data: data })
    }

  })
});

// Editar
app.get( '/panel/employees/edit/:id', adminAuth, function (req, res) {
  Users.findEmployees({ _id: req.params.id }, function (err, docs) {
    if (!err) {
      // {name:'lalala', last_name: 'lalalal', email: 'lalalalal'}
      res.render( 'employees_edit', { title: 'Editar Empleado', doc: docs[0] } );
    } else {
      req.flash( "error", "Ha ocurrido un error, vuelva a intentar mas tarde" );
      res.redirect( '/panel/employees' );
    }
  });
});

app.post( '/panel/employees/edit/:id', adminAuth, function (req, res) {
  var data = { id: req.params.id
             , name      : req.body.name
             , last_name : req.body.last_name
             , email     : req.body.email
             };
  Users.updateEmployee( data, function (err) {
      if ( !err ) {
        req.flash( "info", "La empleado se ha modificado correctamente" );
        res.redirect( '/panel/employees' );
      } else {
        console.log(err)
        data.errors = typeof err.errors !== 'undefined' ? JSON.stringify(err.errors) : 'undefined';
        req.flash( "error", "Ha ocurrido un error al intentar crear el empleado!" );
        res.render( 'employees_edit', { title: 'Editar Personal', doc: data } );
      }
  });
});

// Borrar
app.get( '/panel/employees/delete/:id', adminAuth, function (req, res) {
  Users.remove({ _id: req.params.id  }, function (err, doc) {
    if (!err) {
      req.flash( "info", "El empleado se ha eliminado correctamente" );
      res.redirect( "/panel/employees" );
    } else {
      res.end(err);
    }
  })
});

/****** Site ********/

app.get( '/', function (req, res) {
  res.render('index')
})


app.get( '/employees/search', function (req, res) {
  Users.searchEmployees( '', function (err, docs) {
    if ( err ) {
      res.status(500).json({ error: err })
    } else {
      res.json(docs);
    }
  });
})

app.get( '/employees/search/:keyword', function (req, res) {
  Users.searchEmployees( req.params.keyword , function (err, docs) {
    if ( err ) {
      res.status(500).json({ error: err })
    } else {
      res.json(docs);
    }
  });
})
