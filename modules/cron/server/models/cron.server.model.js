/**
 * Created by eugen on 13/07/16.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Alert Schema
 */
//alerts: _id, user_id, {type:adset,id:adset_id}, param, value, rule, status, period
var CronSchema = new Schema({
  alert: {
    type: Schema.ObjectId,
    ref: 'Alert'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Cron', CronSchema);
