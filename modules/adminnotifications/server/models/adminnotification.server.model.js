'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Adminnotification Schema
 */
var AdminnotificationSchema = new Schema({
  text: {
    type: String,
    required: 'Please fill Adminnotification text',
    trim: true
  },
  status: {
    type: String,
    default: 'Not Sent'
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

mongoose.model('Adminnotification', AdminnotificationSchema);
