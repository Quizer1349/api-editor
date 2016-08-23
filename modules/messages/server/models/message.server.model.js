'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Message Schema
 */

var schemaOptions = {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
};

var MessageSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  event: {
    type: Array,
    ref: 'Notificationevent'
  },
  alert: [
    {
      type: Schema.ObjectId,
      ref: 'Alert'
    }
  ],
  adset:{
    type: Array,
  },
  message: {
    type: String,
    default: '',
    required: 'Please fill Message name',
    trim: true
  },
  type: {
    type: String,
    default: '',
    required: 'Please fill Type',
    trim: true
  },
  status: {
    type: String,
    default: '',
    required: 'Please fill Status',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
}, schemaOptions);

MessageSchema.virtual('adsetData', {
  ref: 'Adset',
  localField: 'adset',
  foreignField: 'adset_id'
});

mongoose.model('Message', MessageSchema);
