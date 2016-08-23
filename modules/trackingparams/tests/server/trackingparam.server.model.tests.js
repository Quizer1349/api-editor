'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Trackingparam = mongoose.model('Trackingparam');

/**
 * Globals
 */
var user, trackingparam;

/**
 * Unit tests
 */
describe('Trackingparam Model Unit Tests:', function() {
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
      trackingparam = new Trackingparam({
        name: 'Cost per Mile',
        value: 'cpm',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return trackingparam.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      trackingparam.name = '';

      return trackingparam.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without value', function(done) {
      trackingparam.value = '';

      return trackingparam.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Trackingparam.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
