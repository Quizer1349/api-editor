'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Trackingparam Schema
 */
var TrackingparamSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Tracking Param name (this is what you  see in selector of alerts',
    trim: true
  },
  value: {
    type: String,
    default: '',
    required: 'Please fill Tracking param value (insights metric name from Api)',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: false,
    trim: true
  },

  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Trackingparam', TrackingparamSchema);
