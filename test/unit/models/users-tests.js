// Users Test Cases
// -----------------------------
var should = require('should');

// require('../../../utils/dbconnect');
require('../../utils');

var Users;

// Unit Tests
describe('Users: models', function(){
  before(function(){
    // Before all tests
    Users = require("../../../models/users.js");
  });

  describe('Validations', function(){


    describe('Required Values', function(){
      it('should have error when required value is not provided', function (done) {

        var user = new Users();

        user.validate( function (err) {
          Object.keys( Users.schema.paths ).forEach(function ( k ) {
            if ( Users.schema.paths[k].isRequired ) {
              err.errors.should.have.property( k ) &&
              err.errors[k].message.should.equal( k + " es obligatorio." );
            }
          });

          done();
        })
      });
      it('should not create a new User', function (done) {
          Users.find( function (err, docs) {
            docs.length.should.be.exactly(0);
            done();
          });
      });
    });

    describe('Email Validation', function(){
      it("should have errors when email is invalid", function(done){
        var user = new Users();
        user.email = "bad email!!"
        user.validate(function(err){
          err.errors.email.message.should.equal("No es un email valido.");
          done();
        })
      })

      it("should have no errors when email is valid", function(done){
        var user = new Users();
        user.email = "test123@email.com"
        user.validate(function(err){
          err.errors.should.not.have.property('email');
          done();
        })
      })
    })

  });

  var user;
  var user_n = Math.floor((Math.random() * 10) + 1)
  var u = {
    name      : 'users_name_' + user_n,
    last_name : 'users_last_name_' + user_n,
    email     : 'user_email_' + user_n + '@test.com',
    password  : '123456'
  }

  describe('CRUD', function(){
    // It should create a new document in the database
    it('should create a new User', function(done){

      Users.create( u, function (err, createdUser) {
        // Confirm that that an error does not exist
        should.not.exist(err);

        // verify that the returned user is what we expect
        createdUser.name.should.equal('users_name_' + user_n);
        createdUser.last_name.should.equal('users_last_name_' + user_n);
        // Call done to tell mocha that we are done with this test
        user = createdUser;
        done();
      });;

    });
  });

  describe('Authentication', function () {
    it('should not authenticate', function (done) {
      user.authenticate( 'bad_password', function (err, isMatch) {
        isMatch.should.not.be.ok;
        done();
      })
    });

    it('should authenticate', function (done) {
      user.authenticate( u.password, function (err, isMatch) {
        if (err) done(err);
        isMatch.should.be.ok;
        done();
      })
    });
  });

});
