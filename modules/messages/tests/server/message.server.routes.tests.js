'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Message = mongoose.model('Message'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, message;

/**
 * Message routes tests
 */
describe('Message CRUD tests', function () {

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

        // Save a user to the test db and create new Message
    user.save(function () {
      message = {
        'user': user,
        'status': 'Sent',
        'type': 'email',
        'message': 'Message',
        'adset': [],
        'alert': [],
        'event': []
      };

      done();
    });
  });

  it('should not be able to get a list of Messages if not signed in', function (done) {
        // Create new Message model instance
    var messageObj = new Message(message);

        // Save the message
    messageObj.save(function () {
            // Request Messages
      agent.get('/api/messages')
                .expect(403)
                .end(function (req, res) {
                    // Set assertion
                    // res.body.rows.should.be.instanceof(Array).and.have.lengthOf(1);

                    // Call the assertion callback
                  done();
                });

    });
  });

  it('should be able to get a list of Messages if signed in', function (done) {
        // Create new Message model instance
    var messageObj = new Message(message);

        // Save the message
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
              messageObj.save(function (err, res) {
                    // Request Messages
                agent.get('/api/messages')
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

  it('should not be able to get a single Message if not signed in', function (done) {
        // Create new Message model instance
    var messageObj = new Message(message);

        // Save the Message
    messageObj.save(function () {
      agent.get('/api/messages/' + messageObj._id)
                .expect(403)
                .end(function (req, res) {

                    // Call the assertion callback
                  done();
                });
    });
  });

  it('should be able to get a single Message if signed in', function (done) {
        // Create new Message model instance
    var messageObj = new Message(message);

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
                // Save the Message
              messageObj.save(function () {
                agent.get('/api/messages/' + messageObj._id)
                        .expect(200)
                        .end(function (req, res) {
                            // Set assertion
                          res.body.should.be.instanceof(Object).and.have.property('message', message.message);

                            // Call the assertion callback
                          done();
                        });
              });
            });
  });

  it('should return proper error for single Message with an invalid Id, if signed in', function (done) {
        // test is not a valid mongoose Id
    agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
              if (signinErr) {

                return done(signinErr);
              }
              agent.get('/api/messages/test')
                    .end(function (req, res) {
                        // Set assertion
                      res.body.should.be.instanceof(Object).and.have.property('message', 'Message is invalid');

                        // Call the assertion callback
                      done();
                    });
            });


  });

  it('should return proper error for single Message which doesnt exist, if signed in', function (done) {
    agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
              if (signinErr) {

                return done(signinErr);
              }
                // This is a valid mongoose Id but a non-existent Message
              agent.get('/api/messages/559e9cd815f80b4c256a8f41')
                    .end(function (req, res) {
                        // Set assertion
                      res.body.should.be.instanceof(Object).and.have.property('message', 'No Message with that identifier has been found');

                        // Call the assertion callback
                      done();
                    });
            });


  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Message.remove().exec(done);
    });
  });
});
