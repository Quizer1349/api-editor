'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Appsetting = mongoose.model('Appsetting'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, appsetting;

/**
 * Appsetting routes tests
 */
describe('Appsetting CRUD tests', function () {

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
      provider: 'local',
      roles: ['admin']
    });

    // Save a user to the test db and create new Appsetting
    user.save(function () {
      appsetting = {
        name: 'Appsetting name',
        value: 'Appsetting value'
      };

      done();
    });
  });

  it('should be able to save a Appsetting if logged in and roles is "admin"', function (done) {
    user.roles = ['admin'];
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

        // Save a new Appsetting
        agent.post('/api/appsettings')
          .send(appsetting)
          .expect(200)
          .end(function (appsettingSaveErr) {
            // Handle Appsetting save error
            if (appsettingSaveErr) {
              return done(appsettingSaveErr);
            }

            // Get a list of Appsettings
            agent.get('/api/appsettings')
              .end(function (appsettingsGetErr, appsettingsGetRes) {
                // Handle Appsetting save error
                if (appsettingsGetErr) {
                  return done(appsettingsGetErr);
                }

                // Get Appsettings list
                var appsettings = appsettingsGetRes.body.rows;

                // Set assertions
                (appsettings[0].user._id).should.equal(userId);
                (appsettings[0].name).should.match('Appsetting name');
                (appsettings[0].value).should.match('Appsetting value');

                // Call the assertion callback
                done();
              });
          });
      });
  });
  it('should not be able to save a Appsetting if logged in and roles is "user"', function (done) {
    user.roles = ['user'];
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Appsetting
        agent.post('/api/appsettings')
          .send(appsetting)
          .expect(403)
          .end(function () {
            done();
          });
      });
  });

  it('should not be able to save an Appsetting if not logged in', function (done) {
    agent.post('/api/appsettings')
      .send(appsetting)
      .expect(403)
      .end(function (appsettingSaveErr) {
        // Call the assertion callback
        done(appsettingSaveErr);
      });
  });

  it('should not be able to save an Appsetting if no name is provided', function (done) {
    // Invalidate name field
    appsetting.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Save a new Appsetting
        agent.post('/api/appsettings')
          .send(appsetting)
          .expect(400)
          .end(function (appsettingSaveErr, appsettingSaveRes) {
            // Set message assertion
            (appsettingSaveRes.body.message).should.match('Please fill name');

            // Handle Appsetting save error
            done(appsettingSaveErr);
          });
      });
  });
  it('should not be able to save an Appsetting if no value is provided', function (done) {
    // Invalidate name field
    appsetting.value = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Appsetting
        agent.post('/api/appsettings')
          .send(appsetting)
          .expect(400)
          .end(function (appsettingSaveErr, appsettingSaveRes) {
            // Set message assertion
            (appsettingSaveRes.body.message).should.match('Please fill value');

            // Handle Appsetting save error
            done(appsettingSaveErr);
          });
      });
  });

  it('should be able to update an Appsetting if signed in and role is admin', function (done) {
    user.roles = ['admin'];
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

        // Save a new Appsetting
        agent.post('/api/appsettings')
          .send(appsetting)
          .expect(200)
          .end(function (appsettingSaveErr, appsettingSaveRes) {
            // Handle Appsetting save error
            if (appsettingSaveErr) {
              return done(appsettingSaveErr);
            }

            // Update Appsetting name
            appsetting.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Appsetting
            agent.put('/api/appsettings/' + appsettingSaveRes.body._id)
              .send(appsetting)
              .expect(200)
              .end(function (appsettingUpdateErr, appsettingUpdateRes) {
                // Handle Appsetting update error
                if (appsettingUpdateErr) {
                  return done(appsettingUpdateErr);
                }

                // Set assertions
                (appsettingUpdateRes.body._id).should.equal(appsettingSaveRes.body._id);
                (appsettingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });
  it('should not be able to update an Appsetting if signed in and role is user', function (done) {
    user.roles = ['user'];
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

        // Save a new Appsetting
        agent.post('/api/appsettings')
          .send(appsetting)
          .expect(403)
          .end(function () {
            // Handle Appsetting save error
            done();
          });
      });
  });

  it('should not be able to get a list of Appsettings if not signed in', function (done) {
    // Create new Appsetting model instance
    var appsettingObj = new Appsetting(appsetting);

    // Save the appsetting
    appsettingObj.save(function () {
      // Request Appsettings
      request(app).get('/api/appsettings')
        .expect(403)
        .end(function (req, res) {

          // Call the assertion callback
          done();
        });

    });
  });

  it('should not be able to get a single Appsetting if not signed in', function (done) {
    // Create new Appsetting model instance
    var appsettingObj = new Appsetting(appsetting);

    // Save the Appsetting
    appsettingObj.save(function () {
      request(app).get('/api/appsettings/' + appsettingObj._id)
        .expect(403)
        .end(function (req, res) {
          done();
        });
    });
  });

  it('should return proper error for single Appsetting with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/appsettings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Appsetting is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Appsetting which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Appsetting
    request(app).get('/api/appsettings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Appsetting with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Appsetting if signed in', function (done) {
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

        // Save a new Appsetting
        agent.post('/api/appsettings')
          .send(appsetting)
          .expect(200)
          .end(function (appsettingSaveErr, appsettingSaveRes) {
            // Handle Appsetting save error
            if (appsettingSaveErr) {
              return done(appsettingSaveErr);
            }

            // Delete an existing Appsetting
            agent.delete('/api/appsettings/' + appsettingSaveRes.body._id)
              .send(appsetting)
              .expect(200)
              .end(function (appsettingDeleteErr, appsettingDeleteRes) {
                // Handle appsetting error error
                if (appsettingDeleteErr) {
                  return done(appsettingDeleteErr);
                }

                // Set assertions
                (appsettingDeleteRes.body._id).should.equal(appsettingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Appsetting if not signed in', function (done) {
    // Set Appsetting user
    appsetting.user = user;

    // Create new Appsetting model instance
    var appsettingObj = new Appsetting(appsetting);

    // Save the Appsetting
    appsettingObj.save(function () {
      // Try deleting Appsetting
      request(app).delete('/api/appsettings/' + appsettingObj._id)
        .expect(403)
        .end(function (appsettingDeleteErr, appsettingDeleteRes) {
          // Set message assertion
          (appsettingDeleteRes.body.message).should.match('User is not authorized');

          // Handle Appsetting error error
          done(appsettingDeleteErr);
        });

    });
  });

  it('should be able to get a single Appsetting that has an orphaned user reference', function (done) {
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

          // Save a new Appsetting
          agent.post('/api/appsettings')
            .send(appsetting)
            .expect(200)
            .end(function (appsettingSaveErr, appsettingSaveRes) {
              // Handle Appsetting save error
              if (appsettingSaveErr) {
                return done(appsettingSaveErr);
              }

              // Set assertions on new Appsetting
              (appsettingSaveRes.body.name).should.equal(appsetting.name);
              should.exist(appsettingSaveRes.body.user);
              should.equal(appsettingSaveRes.body.user._id, orphanId);

              // force the Appsetting to have an orphaned user reference
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

                    // Get the Appsetting
                    agent.get('/api/appsettings/' + appsettingSaveRes.body._id)
                      .expect(200)
                      .end(function (appsettingInfoErr, appsettingInfoRes) {
                        // Handle Appsetting error
                        if (appsettingInfoErr) {
                          return done(appsettingInfoErr);
                        }

                        // Set assertions
                        (appsettingInfoRes.body._id).should.equal(appsettingSaveRes.body._id);
                        (appsettingInfoRes.body.name).should.equal(appsetting.name);
                        should.equal(appsettingInfoRes.body.user, undefined);

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
      Appsetting.remove().exec(done);
    });
  });
});
