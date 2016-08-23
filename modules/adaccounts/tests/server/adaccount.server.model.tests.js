'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Adaccount = mongoose.model('Adaccount');

/**
 * Globals
 */
var user, adaccount;

/**
 * Unit tests
 */
describe('Adaccount Model Unit Tests:', function() {
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
      adaccount = new Adaccount({
        account_id : 'act_1234567',
        account_name: 'Adaccount Name',
        status:'1',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return adaccount.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without account_id', function(done) {
      adaccount.account_id = '';

      return adaccount.save(function(err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without account_name', function(done) {
      adaccount.account_name = '';

      return adaccount.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Adaccount.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
