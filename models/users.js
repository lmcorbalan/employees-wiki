var mongoose = require( 'mongoose' )
  , Schema   = mongoose.Schema
  , bcrypt   = require('bcrypt')
  , SALT_WORK_FACTOR = 10
  , uniqueValidator  = require('mongoose-unique-validator')
  , validate         = require('mongoose-validator')
  , crypto           = require('crypto');


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
   is_admin: { type: Boolean, default: false },
   gravatar: { type: String }
});

userSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico.' });

userSchema.pre("save", function(next) {
  var user = this;

  // email must always be lowercase
  user.email.toLowerCase();

  if (user.isModified('email')) {
    user.gravatar = 'http://www.gravatar.com/avatar/'
      + crypto.createHash('md5').update(user.email).digest("hex")
      + '?d=mm';
  };

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
userSchema.static( 'findEmployees', function (query, cb) {
  var Users = this;

  query.is_admin = false;
  Users.find( query, cb );
});

/**
* Users.updateEmployee(data, function(){}):
*/
userSchema.static( 'updateEmployee', function (data, cb) {
  var Users = this;

  Users.findEmployees({ _id: data.id }, function (err, docs) {
    console.log('updateEmployee');
    if (err) cd(err);
    var emp = docs[0];

    emp.name      = data.name;
    emp.last_name = data.last_name;
    emp.email     = data.email;

    console.log(emp)

    emp.save(cb);
  });
});

/**
* Users.create(data, function(){}):
*/
userSchema.static( 'searchEmployees', function (keyword, cb) {
  var Users = this;

  if (keyword) {
    var like_re = new RegExp(keyword,"i");

    Users.find(
      {
        $or: [ { name: like_re }, { last_name: like_re }, { email: like_re } ],
        is_admin: false
      } ,
      { '_id': 0, 'name': 1, 'last_name': 1, 'email': 1, 'gravatar': 1 },
      cb
    );

  } else {
    Users.find(
      {is_admin: false},
      { '_id': 0, 'name': 1, 'last_name': 1, 'email': 1, 'gravatar': 1 },
      cb
    );
  }
});



var userModel  = mongoose.model( "Users", userSchema );
module.exports = userModel;
