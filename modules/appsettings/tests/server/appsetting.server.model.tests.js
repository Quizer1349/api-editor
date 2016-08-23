'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Appsetting = mongoose.model('Appsetting');

/**
 * Globals
 */
var user, appsetting;

/**
 * Unit tests
 */
describe('Appsetting Model Unit Tests:', function() {
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
      appsetting = new Appsetting({
        name: 'Appsetting Name',
        value: 'Appsetting Value',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return appsetting.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      appsetting.name = '';

      return appsetting.save(function(err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without value', function(done) {
      appsetting.value = '';

      return appsetting.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Appsetting.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
