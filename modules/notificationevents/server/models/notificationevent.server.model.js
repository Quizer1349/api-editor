'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Notificationevent Schema
 */
var schemaOptions = {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
};

var NotificationeventSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  alert: {
    type: Schema.ObjectId,
    ref: 'Alert'
  },
  adset: {
    type: String,
  },
  param: {
    type: String,
    default: '',
    required: 'Please fill Param value',
    trim: true
  },
  value: {
    type: String,
    default: '',
    required: 'Please fill value',
    trim: true
  },
  rule: {
    type: String,
    default: 'empty',
    trim: true
  },
  period: {
    type: String,
    default: 15,
    trim: true
  },

  rulePerfomed: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
}, schemaOptions);

NotificationeventSchema.virtual('adsetData', {
  ref: 'Adset',
  localField: 'adset',
  foreignField: 'adset_id'
});

NotificationeventSchema.virtual('paramData', {
  ref: 'Trackingparam',
  localField: 'param',
  foreignField: 'value'
});

mongoose.model('Notificationevent', NotificationeventSchema);
