'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Logs Schema
 */
var LogsSchema = new Schema({
  place: {
    type: String,
    default: '',
    required: 'Please enter place of log',
    trim: true
  },
  level: {
    type: String,
    default: '',
    required: 'Please select level of log',
    trim: true
  },
  message: {
    type: String,
    default: '',
    required: 'Please enter mesage of log',
    trim: true
  },
  data: {
    type: Schema.Types.Mixed,
    default: '',
    required: false,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Logs', LogsSchema);
