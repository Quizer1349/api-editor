'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config'));

/**
 * Alerts module init function.
 */
module.exports = function (app, db) {
  config.smtp = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'info.mediabuyer@gmail.com',
      pass: '!qw2e3r4'
    }
  };
};
