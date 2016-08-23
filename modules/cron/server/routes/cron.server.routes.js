/**
 * Created by eugen on 29/07/16.
 */
'use strict';

/**
 * Module dependencies.
 */
var CronService = require('../services/cron.server.service.js'),
  cronService = new CronService();

module.exports = function (app) {
  cronService.start();
};
