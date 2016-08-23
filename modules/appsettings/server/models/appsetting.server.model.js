'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Appsetting Schema
 */
var AppsettingSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill name',
    trim: true
  },
  value: {
    type: String,
    default: '',
    required: 'Please fill value',
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

mongoose.model('Appsetting', AppsettingSchema);
