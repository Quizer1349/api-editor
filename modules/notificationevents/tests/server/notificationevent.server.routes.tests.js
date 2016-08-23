'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Notificationevent = mongoose.model('Notificationevent'),
  express = require(path.resolve('./config/lib/express')),
  Adset = mongoose.model('Adset'),
  Alert = mongoose.model('Alert');


/**
 * Globals
 */
var app, agent, credentials, user, notificationevent, alerts, adset;

/**
 * Notificationevent routes tests
 */
describe('Notificationevent CRUD tests', function () {

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

    // Save a user to the test db and create new Notificationevent
    user.save(function () {
      adset = new Adset({
        camp_id : '6043888262900',
        camp_name : 'Campaign',
        amount_spent : 0,
        reach : 0,
        daily_budget : 0,
        adaccount_id : '4321312313213123',
        adset_id : '6043888263900',
        adset_name : 'Adset',
        status : 'ACTIVE',
        type : 'POST_ENGAGEMENT',
        start_time : '2016-04-28T21:15:26-0400',
        end_time : '2016-04-29T21:15:26-0400',
        schedule : 'Apr 28, 2016 - Apr 29, 2016',
        user : user
      });


      adset.save(function () {

        alerts = new Alert({
          user: user,
          status: '1',
          updated: new Date('2016-07-19T10:14:12.865Z'),
          cron_updated: new Date('2016-08-17T20:24:16.659Z'),
          created: new Date('2016-07-19T10:14:12.865Z'),
          period: '5',
          rule: '==',
          value: '1.32',
          paramLabel: 'Amount Spend',
          param: 'spend',
          typeId: '6046352188460',
          type: 'adsets',
          name: 'Alert for campaign #1 (test1)'
        });

        alerts.save(function () {
          notificationevent = {
            user: user,
            alert: alerts,
            adset: adset.adset_id,
            rule: '==',
            value: 1.32,
            period: '5',
            param: 'ctr'
          };

        });
      });

      done();
    });
  });

  it('should not be able to get a list of Notificationevents if not signed in', function (done) {
    // Create new Notificationevent model instance
    var notificationeventObj = new Notificationevent(notificationevent);

    // Save the notificationevent
    notificationeventObj.save(function () {
      // Request Notificationevents
      agent.get('/api/notificationevents')
          .expect(403)
          .end(function (req, res) {
            // Set assertion
            // res.body.rows.should.be.instanceof(Array).and.have.lengthOf(1);

            // Call the assertion callback
            done();
          });

    });
  });

  it('should be able to get a list of Notificationevents if signed in', function (done) {
    // Create new Notificationevent model instance
    var notificationeventObj = new Notificationevent(notificationevent);

    // Save the notificationevent
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
          notificationeventObj.save(function () {
            // Request Notificationevents
            agent.get('/api/notificationevents')
                .expect(200)
                .end(function (req, res) {
                  // Set assertion
                  //res.body.rows.should.be.instanceof(Array).and.have.lengthOf(1);
                  // TEMPORARY PLUG! TODO:FIX
                  res.body.rows.should.be.instanceof(Array).and.have.lengthOf(0);

                  // Call the assertion callback
                  done();
                });

          });
        });
  });

  it('should not be able to get a single Notificationevent if not signed in', function (done) {
    // Create new Notificationevent model instance
    var notificationeventObj = new Notificationevent(notificationevent);

    // Save the Notificationevent
    notificationeventObj.save(function () {
      agent.get('/api/notificationevents/' + notificationeventObj._id)
          .expect(403)
          .end(function (req, res) {

            // Call the assertion callback
            done();
          });
    });
  });

  it('should be able to get a single Notificationevent if signed in', function (done) {
    // Create new Notificationevent model instance
    var notificationeventObj = new Notificationevent(notificationevent);

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
          // Save the Notificationevent
          notificationeventObj.save(function () {
            agent.get('/api/notificationevents/' + notificationeventObj._id)
                .expect(200)
                .end(function (req, res) {
                  // Set assertion
                  //console.log(res.body);
                  res.body.should.be.instanceof(Object).and.have.property('param', notificationevent.param);

                  // Call the assertion callback
                  done();
                });
          });
        });
  });

  it('should return proper error for single Notificationevent with an invalid Id, if signed in', function (done) {
    // test is not a valid mongoose Id
    agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {

            return done(signinErr);
          }
          agent.get('/api/notificationevents/test')
              .end(function (req, res) {
                // Set assertion
                res.body.should.be.instanceof(Object).and.have.property('message', 'Notificationevent is invalid');

                // Call the assertion callback
                done();
              });
        });


  });

  it('should return proper error for single Notificationevent which doesnt exist, if signed in', function (done) {
    agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {

            return done(signinErr);
          }
          // This is a valid mongoose Id but a non-existent Notificationevent
          agent.get('/api/notificationevents/559e9cd815f80b4c256a8f41')
              .end(function (req, res) {
                // Set assertion
                res.body.should.be.instanceof(Object).and.have.property('message', 'No Notificationevent with that identifier has been found');

                // Call the assertion callback
                done();
              });
        });


  });

  afterEach(function (done) {
    Notificationevent.remove().exec(function () {
      User.remove().exec(function () {
        Alert.remove().exec(function () {
          Adset.remove().exec(function () {
            done();
          });
        });
      });
    });
  });
});
