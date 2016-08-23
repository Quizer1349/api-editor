'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Notificationevent = mongoose.model('Notificationevent'),
  Adset = mongoose.model('Adset'),
  Alert = mongoose.model('Alert');

/**
 * Globals
 */
var user, notificationevent, adset, alerts;

/**
 * Unit tests
 */
describe('Notificationevent Model Unit Tests:', function() {
  beforeEach(function(done) {

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3',
      provider: 'local'
    });



    user.save(function() {

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
          user : user,
          status : '1',
          updated : new Date('2016-07-19T10:14:12.865Z'),
          cron_updated : new Date('2016-08-17T20:24:16.659Z'),
          created :  new Date('2016-07-19T10:14:12.865Z'),
          period : '5',
          rule : '==',
          value : '1.32',
          paramLabel : 'Amount Spend',
          param : 'spend',
          typeId : '6046352188460',
          type : 'adsets',
          name : 'Alert for campaign #1 (test1)'
        });

        alerts.save(function () {

          notificationevent = new Notificationevent({
            user: user,
            alert:alerts,
            adset:adset.adset_id,
            rule:'==',
            value: 1.32,
            period:'5',
            param: 'ctr'
          });
          done();
        });

      });


    });

  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return notificationevent.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without param', function(done) {
      notificationevent.param = '';

      return notificationevent.save(function(err) {
        should.exist(err);
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
