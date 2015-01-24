'use strict';

var request = require('request');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'bin/www'
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          clearRequireCache: true
        },
        src: ['test/**/*.js']
      },
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      server: {
        files: [
          'bin/www',
          'app.js',
          'routes/*.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      js: {
        files: ['public/js/*.js'],
        options: {
          livereload: reloadPort
        }
      },
      css: {
        files: ['public/css/*.css'],
        options: {
          livereload: reloadPort
        }
      },
      views: {
        files: ['views/*.jade'],
        options: {
          livereload: reloadPort
        }
      },
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      // tests: {
      //   options: { livereload: 35729 },
      //   files: ['./test/**/*.js'],
      //   tasks: ['mochaTest']
      // },
      scripts: {
        options: {
          livereload: 35729,
          debounceDelay: 750
        },
        files: ['./app.js', './Gruntfile.js', './bin/www',
        './models/*.js', './routes/*.js', './forms/*.js'],
        // tasks: ['jshint','mochaTest','docco'],
        // tasks: ['mochaTest']
      }
    },
    wiredep: {
      target: {
        src: ['views/layout.jade'],
        ignorePath: '../public'
      }
    }
  });

  grunt.config.requires('watch.server.files');
  files = grunt.config('watch.server.files');
  files = grunt.file.expand(files);

  // On watch events, if the changed file is a test file then configure mochaTest to only
  // run the tests from that file. Otherwise run all the tests
  // var defaultTestSrc = grunt.config('mochaTest.test.src');
  // grunt.event.on('watch', function(action, filepath) {
  //   grunt.config('mochaTest.test.src', defaultTestSrc);
  //   if ( filepath.match('test/') && filepath !== 'test/utils/index.js' ) {
  //     grunt.config('mochaTest.test.src', filepath);
  //   }
  // });

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function (err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded) {
            grunt.log.ok('Delayed live reload successful.');
          } else {
            grunt.log.error('Unable to make a delayed live reload.');
          }
          done(reloaded);
        });
    }, 500);

  });

  grunt.registerTask('default', ['develop', 'watch']);
  grunt.registerTask('test', ['mochaTest']);

};
