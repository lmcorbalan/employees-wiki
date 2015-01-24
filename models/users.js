var mongoose = require( 'mongoose' )
  , Schema   = mongoose.Schema
  , bcrypt   = require('bcrypt')
  , SALT_WORK_FACTOR = 10
  , uniqueValidator  = require('mongoose-unique-validator')
  , validate         = require('mongoose-validator');


var emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'No es un email valido.'
  })
];

var requireMssg = '{PATH} es obligatorio.';
// FIXME
//  - id autonumerico....ver mongoose-auto-increment
var userSchema = new Schema({
       name: { type: String, required: requireMssg },
  last_name: { type: String, required: requireMssg },
      email: { type: String, required: requireMssg, index: true, unique: true, validate: emailValidator },
   password: { type: String, required: requireMssg },
   is_admin: { type: Boolean, default: false }
});

userSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico.' });

userSchema.pre("save", function(next) {
  var user = this;

  // email must always be lowercase
  user.email.toLowerCase();

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

userSchema.method('authenticate', function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
});


/**
* Users.create(data, function(){}):
*/
userSchema.static.create = function (data, cb) {
  var Users = this; // Esto se hace siempre que se haga un metodo estatico para fijar el scope

  var e = new Users({
    name     : data.name,
    last_name: data.last_name,
    email    : data.email,
    password : data.password,
    is_admin : data.is_admin
  });

  e.save( cb );
}

/**
* Users.create(data, function(){}):
*/
userSchema.static( 'findEmployees', function (cb) {
  var Users = this;

  Users.find( {is_admin: false}, cb );
});

/** TODO
* Users.delete(email, function(){}):
* Controlar que el usuario que se esta intentando eliminar no sea el logueado
*/

var userModel  = mongoose.model( "Users", userSchema );
module.exports = userModel;
