/**
 * Created by eugen on 25/07/16.
 */
'use strict';

var fs = require('fs'),
  Log = require('log'),
  mongoose = require('mongoose'),
  LogsModel = mongoose.model('Logs');
/***
 * Initialize log and private function makeLog
 * @constructor
 */
var Logs = function () {
  this.log = new Log('info', fs.createWriteStream('app.log', { flags: 'a' }));
    /***
     * Write log to app.log file, and add new row to collection logs
     * @param level
     * @param place
     * @param message
     * @param data
     */
  this.makeLog = function (level, place, message, data) {
    place = place || 'No place';
    message = message || 'No message';
    data = data || null;
    switch (level) {
      case 'info':
                /*jshint validthis: true */
        this.log.info(message);
        break;
      case 'warning':
                /*jshint validthis: true */
        this.log.warning(message);
        break;
      case 'error':
                /*jshint validthis: true */
        this.log.error(message);
        break;
      default:
                /*jshint validthis: true */
        this.log.info(message);
        break;
    }

    var logsObject = { level: level, place: place, message: message, data: data };
    var LogsCollection = new LogsModel(logsObject);
    LogsCollection.save(function (err) {
      if (err) {
        console.log(err);
      }
    });
  };
};

/***
 * Constants for log functions
 */
Logs.prototype.FB_REQUESTER_INTERNAL_ERROR = 'FB_REQUESTER_INTERNAL_ERROR';

Logs.prototype.PHRASE_RESPONSE_FROM = 'Response from ';
Logs.prototype.PHRASE_REQUEST_TO = 'Request to ';

Logs.prototype.FB_REQUESTER_ACCOUNTS = 'FB_REQUESTER_ACCOUNTS';
Logs.prototype.FB_REQUESTER_ADSETS = 'FB_REQUESTER_ADSETS';
Logs.prototype.FB_REQUESTER_ADSETS_INSIGHTS = 'FB_REQUESTER_ADSETS_INSIGHTS';
Logs.prototype.MESSENGER = 'MESSENGER';
Logs.prototype.WEBHOOK = 'WEBHOOK';
Logs.prototype.CRON_SERVICE = 'CRON';
Logs.prototype.APP_SETTINGS = 'APP_SETTINGS';
Logs.prototype.APP_CORE_INIT_SETTINGS = 'APP_CORE_INIT_SETTINGS';

/***
 * Make log with level info to file app.log and model logs
 * @param place - where method was called
 * @param message - log message
 * @param data - additional data for log
 */
Logs.prototype.info = function (place, message, data) {
  this.makeLog('info', place, message, data);
};

/***
 * Make log with level warning to file app.log and model logs
 * @param place - where method was called
 * @param message - log message
 * @param data - additional data for log
 */
Logs.prototype.warning = function (place, message, data) {
  this.makeLog('warning', place, message, data);
};

/***
 * Make log with level error to file app.log and model logs
 * @param place - where method was called
 * @param message - log message
 * @param data - additional data for log
 */
Logs.prototype.error = function (place, message, data) {
  this.makeLog('error', place, message, data);
};

module.exports = Logs;
