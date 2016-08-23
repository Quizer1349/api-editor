'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Trackingparam = mongoose.model('Trackingparam'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, trackingparam;

/**
 * Trackingparam routes tests
 */
describe('Trackingparam CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Trackingparam
    user.save(function () {
      trackingparam = {
        name: 'Cost per Mile',
        value: 'cpm',
        user: user
      };

      done();
    });
  });

  it('should not be able to get a list of Trackingparams if not signed in', function (done) {
    // Create new Trackingparam model instance
    var trackingparamObj = new Trackingparam(trackingparam);

    // Save the Trackingparam
    trackingparamObj.save(function () {
      // Request Trackingparams
      agent.get('/api/trackingparams')
          .expect(403)
          .end(function (req, res) {
            // Set assertion
            // res.body.rows.should.be.instanceof(Array).and.have.lengthOf(1);

            // Call the assertion callback
            done();
          });

    });
  });

  it('should be able to get a list of Trackingparams if signed in', function (done) {
    // Create new Trackingparam model instance
    var trackingparamObj = new Trackingparam(trackingparam);

    // Save the Trackingparam
    agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {

            return done(signinErr);
          }
          // Get the userId
          var userId = user.id;
          trackingparamObj.save(function (err, res) {
            // Request Trackingparams
            agent.get('/api/trackingparams')
                .expect(200)
                .end(function (req, res) {
                  // Set assertion
                  //res.body.rows.should.be.instanceof(Array).and.have.lengthOf(1);

                  // Call the assertion callback
                  done();
                });

          });
        });
  });

  it('should not be able to get a single Trackingparam if not signed in', function (done) {
    // Create new Trackingparam model instance
    var trackingparamObj = new Trackingparam(trackingparam);

    // Save the Trackingparam
    trackingparamObj.save(function () {
      agent.get('/api/trackingparams/' + trackingparamObj._id)
          .expect(403)
          .end(function (req, res) {

            // Call the assertion callback
            done();
          });
    });
  });

  it('should be able to get a single Trackingparam if signed in', function (done) {
    // Create new Trackingparam model instance
    var trackingparamObj = new Trackingparam(trackingparam);

    agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {

            return done(signinErr);
          }
          // Get the userId
          var userId = user.id;
          // Save the Trackingparam
          trackingparamObj.save(function () {
            agent.get('/api/trackingparams/' + trackingparamObj._id)
                .expect(200)
                .end(function (req, res) {
                  // Set assertion
                  res.body.should.be.instanceof(Object).and.have.property('value', trackingparam.value);

                  // Call the assertion callback
                  done();
                });
          });
        });
  });

  it('should return proper error for single Trackingparam with an invalid Id, if signed in', function (done) {
    // test is not a valid mongoose Id
    agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {

            return done(signinErr);
          }
          agent.get('/api/trackingparams/test')
              .end(function (req, res) {
                // Set assertion
                res.body.should.be.instanceof(Object).and.have.property('message', 'Trackingparam is invalid');

                // Call the assertion callback
                done();
              });
        });


  });

  it('should return proper error for single Trackingparam which doesnt exist, if signed in', function (done) {
    agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {

            return done(signinErr);
          }
          // This is a valid mongoose Id but a non-existent Trackingparam
          agent.get('/api/trackingparams/559e9cd815f80b4c256a8f41')
              .end(function (req, res) {
                // Set assertion
                res.body.should.be.instanceof(Object).and.have.property('message', 'No Trackingparam with that identifier has been found');

                // Call the assertion callback
                done();
              });
        });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Trackingparam.remove().exec(done);
    });
  });
});
