'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Logs = mongoose.model('Logs');

/**
 * Globals
 */
var user, logs;

/**
 * Unit tests
 */
describe('Logs Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() { 
      logs = new Logs({
        place: 'MESSENGER',
        level: 'info',
        message: 'Message was sent',
        data: [{ 1:1, 2:2 }, { 3:3, 4:4 }]
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      return logs.save(function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Logs.remove().exec();
    User.remove().exec();

    done();
  });
});
