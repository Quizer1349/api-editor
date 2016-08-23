'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Message = mongoose.model('Message');

/**
 * Globals
 */
var user, message;

/**
 * Unit tests
 */
describe('Message Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function (userObj) {
      message = new Message({
        'user': userObj._id,
        'status': 'Sent',
        'type': 'email',
        'message': 'Message',
        'adset': [
          '6046352188460'
        ],
        'alert': [
          '57ade41ba7121c897acf6d63'
        ],
        'event': [
          '57b192498b2fa20511ea49d2'
        ]
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return message.save(function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Message.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
