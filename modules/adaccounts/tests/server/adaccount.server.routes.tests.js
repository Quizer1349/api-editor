'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Adaccount = mongoose.model('Adaccount'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, adaccount;

/**
 * Adaccount routes tests
 */
describe('Adaccount CRUD tests', function () {

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

    // Save a user to the test db and create new Adaccount
    user.save(function () {
      adaccount = new Adaccount({
        account_id : 'act_123456789',
        account_name: 'Adaccount Name 2',
        status:'1',
        user:user
      });

      done();
    });
  });

  it('should be able to save an Adaccount if logged in', function (done) {
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

        // Save a new Adaccount
        agent.post('/api/adaccounts')
          .send(adaccount)
          .expect(200)
          .end(function (adaccountSaveErr, adaccountSaveRes) {
            // Handle Adaccount save error
            if (adaccountSaveErr) {
              return done(adaccountSaveErr);
            }

            // Get a list of Adaccounts
            agent.get('/api/adaccounts')
              .end(function (adaccountsGetErr, adaccountsGetRes) {
                // Handle Adaccount save error
                if (adaccountsGetErr) {
                  return done(adaccountsGetErr);
                }

                // Get Adaccounts list
                var adaccounts = adaccountsGetRes.body.rows;

                // Set assertions

                (adaccounts[0].user._id).should.equal(userId);
                (adaccounts[0].account_id).should.match('act_123456789');
                (adaccounts[0].account_name).should.match('Adaccount Name 2');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Adaccount if not logged in', function (done) {
    agent.post('/api/adaccounts')
      .send(adaccount)
      .expect(403)
      .end(function (adaccountSaveErr, adaccountSaveRes) {
        // Call the assertion callback
        done(adaccountSaveErr);
      });
  });

  it('should not be able to save an Adaccount if no name is provided', function (done) {
    // Invalidate name field
    adaccount.account_name = '';

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

        // Save a new Adaccount
        agent.post('/api/adaccounts')
          .send(adaccount)
          .expect(400)
          .end(function (adaccountSaveErr, adaccountSaveRes) {
            // Set message assertion
            (adaccountSaveRes.body.message).should.match('Please fill in account_name');

            // Handle Adaccount save error
            done(adaccountSaveErr);
          });
      });
  });

  it('should be able to update an Adaccount if signed in', function (done) {
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

        // Save a new Adaccount
        agent.post('/api/adaccounts')
          .send(adaccount)
          .expect(200)
          .end(function (adaccountSaveErr, adaccountSaveRes) {
            // Handle Adaccount save error
            if (adaccountSaveErr) {
              return done(adaccountSaveErr);
            }

            // Update Adaccount name
            adaccount.account_id = 'act_1234567890';

              // Update Adaccount name
            adaccount.account_name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Adaccount
            agent.put('/api/adaccounts/' + adaccountSaveRes.body._id)
              .send(adaccount)
              .expect(200)
              .end(function (adaccountUpdateErr, adaccountUpdateRes) {
                // Handle Adaccount update error
                if (adaccountUpdateErr) {
                  return done(adaccountUpdateErr);
                }

                // Set assertions
                (adaccountUpdateRes.body._id).should.equal(adaccountSaveRes.body._id);
                (adaccountUpdateRes.body.account_name).should.match('WHY YOU GOTTA BE SO MEAN?');
                (adaccountUpdateRes.body.account_id).should.match('act_1234567890');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Adaccounts if not signed in', function (done) {
    // Create new Adaccount model instance
    var adaccountObj = new Adaccount(adaccount);


    // Save the adaccount
    adaccountObj.save(function () {

      // Request Adaccounts
      request(app).get('/api/adaccounts')
        .end(function (req, res) {
          // Set assertion

          res.body.rows.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Adaccount if not signed in', function (done) {
    // Create new Adaccount model instance
    var adaccountObj = new Adaccount(adaccount);

    // Save the Adaccount
    adaccountObj.save(function () {
      request(app).get('/api/adaccounts/' + adaccountObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('account_name', adaccount.account_name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Adaccount with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/adaccounts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Adaccount is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Adaccount which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Adaccount
    request(app).get('/api/adaccounts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Adaccount with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Adaccount if signed in', function (done) {
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

        // Save a new Adaccount
        agent.post('/api/adaccounts')
          .send(adaccount)
          .expect(200)
          .end(function (adaccountSaveErr, adaccountSaveRes) {
            // Handle Adaccount save error
            if (adaccountSaveErr) {
              return done(adaccountSaveErr);
            }

            // Delete an existing Adaccount
            agent.delete('/api/adaccounts/' + adaccountSaveRes.body._id)
              .send(adaccount)
              .expect(200)
              .end(function (adaccountDeleteErr, adaccountDeleteRes) {
                // Handle adaccount error error
                if (adaccountDeleteErr) {
                  return done(adaccountDeleteErr);
                }

                // Set assertions
                (adaccountDeleteRes.body._id).should.equal(adaccountSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Adaccount if not signed in', function (done) {
    // Set Adaccount user
    adaccount.user = user;

    // Create new Adaccount model instance
    var adaccountObj = new Adaccount(adaccount);

    // Save the Adaccount
    adaccountObj.save(function () {
      // Try deleting Adaccount
      request(app).delete('/api/adaccounts/' + adaccountObj._id)
        .expect(403)
        .end(function (adaccountDeleteErr, adaccountDeleteRes) {
          // Set message assertion
          (adaccountDeleteRes.body.message).should.match('User is not authorized');

          // Handle Adaccount error error
          done(adaccountDeleteErr);
        });

    });
  });

  it('should be able to get a single Adaccount that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Adaccount
          agent.post('/api/adaccounts')
            .send(adaccount)
            .expect(200)
            .end(function (adaccountSaveErr, adaccountSaveRes) {
              // Handle Adaccount save error
              if (adaccountSaveErr) {
                return done(adaccountSaveErr);
              }

              // Set assertions on new Adaccount
              (adaccountSaveRes.body.account_name).should.equal(adaccount.account_name);
              should.exist(adaccountSaveRes.body.user);
              should.equal(adaccountSaveRes.body.user._id, orphanId);

              // force the Adaccount to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Adaccount
                    agent.get('/api/adaccounts/' + adaccountSaveRes.body._id)
                      .expect(200)
                      .end(function (adaccountInfoErr, adaccountInfoRes) {
                        // Handle Adaccount error
                        if (adaccountInfoErr) {
                          return done(adaccountInfoErr);
                        }

                        // Set assertions
                        (adaccountInfoRes.body._id).should.equal(adaccountSaveRes.body._id);
                        (adaccountInfoRes.body.account_name).should.equal(adaccount.account_name);
                        should.equal(adaccountInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Adaccount.remove().exec(done);
    });
  });
});
