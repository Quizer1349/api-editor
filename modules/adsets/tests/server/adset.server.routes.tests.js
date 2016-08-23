'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Adset = mongoose.model('Adset'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, adset;

/**
 * Adset routes tests
 */
describe('Adset CRUD tests', function () {

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

        // Save a user to the test db and create new Adset
    user.save(function () {
      adset = new Adset({
        camp_id: 1234567890,
        camp_name: 'Campaign Name',
        amount_spent: 1000000,
        reach: 5000,
        daily_budget: 10000,
        adset_id: 1234567890,
        adset_name: 'Adset Name',
        status: 'ACTIVE',
        type: 'ADSET TYPE',
        start_time: '2016-08-06T16:20:59-0400',
        end_time: '2016-08-10T16:20:59-0400',
        schedule: '2016-08-10T16:20:59-0400',
        adaccount_id: '1123123',
        user: user
      });

      done();
    });
  });

  it('should not be able to get a list of Adsets if not signed in', function (done) {
        // Create new Adset model instance
    var adsetObj = new Adset(adset);

        // Save the adset
    adsetObj.save(function () {
            // Request Adsets
      agent.get('/api/adsets')
                .expect(403)
                .end(function (req, res) {
                    // Set assertion
                    // res.body.rows.should.be.instanceof(Array).and.have.lengthOf(1);

                    // Call the assertion callback
                  done();
                });

    });
  });

  it('should be able to get a list of Adsets if signed in', function (done) {
        // Create new Adset model instance
    var adsetObj = new Adset(adset);

        // Save the adset
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
              adsetObj.save(function () {
                    // Request Adsets
                agent.get('/api/adsets')
                        .expect(200)
                        .end(function (req, res) {
                            // Set assertion
                          res.body.rows.should.be.instanceof(Array).and.have.lengthOf(1);

                            // Call the assertion callback
                          done();
                        });

              });
            });
  });

  it('should not be able to get a single Adset if not signed in', function (done) {
        // Create new Adset model instance
    var adsetObj = new Adset(adset);

        // Save the Adset
    adsetObj.save(function () {
      agent.get('/api/adsets/' + adsetObj._id)
                .expect(403)
                .end(function (req, res) {

                    // Call the assertion callback
                  done();
                });
    });
  });

  it('should be able to get a single Adset if signed in', function (done) {
        // Create new Adset model instance
    var adsetObj = new Adset(adset);

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
                // Save the Adset
              adsetObj.save(function () {
                agent.get('/api/adsets/' + adsetObj._id)
                        .expect(200)
                        .end(function (req, res) {
                            // Set assertion
                          res.body.should.be.instanceof(Object).and.have.property('adset_name', adset.adset_name);

                            // Call the assertion callback
                          done();
                        });
              });
            });
  });

  it('should return proper error for single Adset with an invalid Id, if signed in', function (done) {
        // test is not a valid mongoose Id
    agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
              if (signinErr) {

                return done(signinErr);
              }
              agent.get('/api/adsets/test')
                    .end(function (req, res) {
                        // Set assertion
                      res.body.should.be.instanceof(Object).and.have.property('message', 'Adset is invalid');

                        // Call the assertion callback
                      done();
                    });
            });


  });

  it('should return proper error for single Adset which doesnt exist, if signed in', function (done) {
    agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
              if (signinErr) {

                return done(signinErr);
              }
                // This is a valid mongoose Id but a non-existent Adset
              agent.get('/api/adsets/559e9cd815f80b4c256a8f41')
                    .end(function (req, res) {
                        // Set assertion
                      res.body.should.be.instanceof(Object).and.have.property('message', 'No Adset with that identifier has been found');

                        // Call the assertion callback
                      done();
                    });
            });


  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Adset.remove().exec(done);
    });
  });
});
