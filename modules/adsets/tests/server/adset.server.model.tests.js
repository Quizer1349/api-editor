'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Adset = mongoose.model('Adset');

/**
 * Globals
 */
var user, adset;

/**
 * Unit tests
 */
describe('Adset Model Unit Tests:', function() {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      adset = new Adset({
        camp_id: 1234567890,
        camp_name: 'Campaign Name',
        amount_spent: 1000000,
        reach: 5000,
        daily_budget: 10000,
        adset_id: 1234567890,
        adset_name: 'Adset Name',
        status: 'ACTIVE',
        type: 'ADSET TYPE',
        start_time: '2016-08-06T16:20:59-0400',
        end_time: '2016-08-10T16:20:59-0400',
        schedule: '2016-08-10T16:20:59-0400',
        adaccount_id: '1123123',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return adset.save(function (err) {
        should.not.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without camp_id', function (done) {
      adset.camp_id = '';

      return adset.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without camp_name', function (done) {
      adset.camp_name = '';

      return adset.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without amount_spent', function (done) {
      adset.amount_spent = '';

      return adset.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without reach', function (done) {
      adset.reach = '';

      return adset.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without daily_budget', function (done) {
      adset.daily_budget = '';

      return adset.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without adset_id', function (done) {
      adset.adset_id = '';

      return adset.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without adset_name', function (done) {
      adset.adset_name = '';

      return adset.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without status', function (done) {
      adset.status = '';

      return adset.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without type', function (done) {
      adset.type = '';

      return adset.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without start_time', function (done) {
      adset.start_time = '';

      return adset.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without end_time', function (done) {
      adset.end_time = '';

      return adset.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without schedule', function (done) {
      adset.schedule = '';

      return adset.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without adaccount_id', function (done) {
      adset.adaccount_id = '';

      return adset.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    Adset.remove().exec(function(){
      User.remove().exec(function(){
        done();  
      });
    });
  });
});
