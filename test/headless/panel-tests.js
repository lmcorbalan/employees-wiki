var should = require('should')
  , config = require('../../config')
  , Browser = require('zombie');


var Users
  , admin
  , browser
  , base_url = 'http://' + config.app.domain + ':' + config.app.port;

describe( 'Admin Panel', function () {
  before( function(){

    browser = new Browser({debug:false});

  });

  describe( 'Login', function () {
    it('should refuse invalid email', function (done) {
      browser.visit( base_url + "/admin")
        .then(function () {
          browser.success.should.be.ok;

          browser.fill('email', 'foobar');
          browser.fill('password', '123456');
          return browser.pressButton('Ingresar');
        })
        .then(function () {
          browser.text('div#helpBlock').should.equal("No es un email valido.")
        })
        .then(done, done);
    });

    it('should refuse non-existent email', function (done) {
      browser.visit( base_url + "/admin")
        .then(function () {
          browser.success.should.be.ok;

          browser.fill('email', 'foo@bar.com');
          browser.fill('password', '123456');
          return browser.pressButton('Ingresar');
        })
        .then(function () {
          browser.text('div.alert.alert-danger').should.equal("Email incorrecto")
        })
        .then(done, done);;
    });

    it('should refuse incorrect password', function (done) {
        browser.visit( base_url + "/admin")
        .then(function () {
          browser.success.should.be.ok;

          browser.fill('email', 'admin@admin.com');
          browser.fill('password', 'foobar');
          return browser.pressButton('Ingresar');
        })
        .then(function () {
          browser.text('div.alert.alert-danger').should.equal("Password incorrecto")
        })
        .then(done, done);;
    });


    it('should login', function (done) {
      browser.visit( base_url + "/admin")
        .then(function () {
          // assert.ok(browser.success);
          browser.success.should.be.ok;
          // Fill email, password and submit form
          browser.fill('email', 'admin@admin.com');
          browser.fill('password', '123456');
          return browser.pressButton('Ingresar');
        })
        .then(function () {
          // assert.ok(browser.success);
          // assert.equal(browser.location.pathname, "/panel");
          browser.success.should.be.ok;
          browser.location.pathname.should.equal( "/panel/employees")
        })
        .then(done, done)
    });

  });

  describe( 'Logout', function () {
    it('should logout', function (done) {
      browser.visit( base_url + "/panel")
        .then(function () {
          browser.success.should.be.ok;
          return browser.clickLink('#logout');
        })
        .then(function () {
          browser.success.should.be.ok;
          browser.location.pathname.should.equal( "/admin")
          browser.text('div.alert.alert-info').should.equal("Adios!")
        })
        .then(done, done);
    });
  });

  describe( 'CRUD', function () {
    before(function (done) {
      browser.visit( base_url + "/admin")
        .then(function () {
          browser.fill('email', 'foobar');
          browser.fill('password', '123456');
          return browser.pressButton('Ingresar');
        })
        .then(done, done);
    })

    it('should list employees', function (done) {
      browser.visit( base_url + "/panel/employees")
        .then(function () {
          browser.success.should.be.ok;
          browser.text("title").should.equal("Listado de Empleados");
          browser.text("h1").should.equal("Listado de Empleados");

          var employees_count = User.count({ is_admin: false });
          browser.document.querySelectorAll('table tbody tr').length.should.equal( employees_count );

          return browser.pressButton('Ingresar');
        })
        .then(done, done);
    })

  });

});



