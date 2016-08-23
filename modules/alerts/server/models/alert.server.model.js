'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto');

function generateHash(length)
{
  var text = '';
  var possible = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  for(var i=0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
var schemaOptions = {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
};
/**
 * Alert Schema
 */
//alerts: _id, user_id, {type:adset,id:adset_id}, param, value, rule, status, period
var AlertSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please enter alert name',
    trim: true
  },
  type: {
    type: String,
    default: 'adsets',
    required: 'Please select type',
    trim: false
  },
  typeId: {
    type: String,
    default: '',
    required: 'Please select type Id (adsets id default)',
    trim: true
  },
  adaccount_id: {
    type: String,
    default: '',
    trim: true
  },
  param: {
    type: String,
    default: '',
    required: 'Please select param to track',
    trim: true
  },
  paramLabel: {
    type: String,
    default: '',
    required: 'Please select param label to track',
    trim: true
  },
  value: {
    type: String,
    default: '',
    required: 'Please enter param value',
    trim: true
  },

  rule: {
    type: String,
    default: '',
    required: 'Please select rule',
    trim: true
  },

  period: {
    type: String,
    default: '',
    required: 'Please select period',
    trim: true
  },

  created: {
    type: Date,
    default: Date.now
  },
  cron_updated: {
    type: Date,
  },
  updated: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    default: '',
    required: 'Please select status',
    trim: true
  },
  emailEnabled:{
    type: Boolean,
    default: true
  },
  messengerEnabled:{
    type: Boolean,
    default: true
  },
  smsEnabled:{
    type: Boolean,
    default: false
  },
  shortHash:{
    type: String,
    default: ''
  }

}, schemaOptions);

/**
 * Hook a pre save method to generate
 */
AlertSchema.pre('save', function (next) {
  this.shortHash = generateHash(5);
  next();
});

AlertSchema.post('remove', function (doc) {
  var EventModel = mongoose.model('Notificationevent');
  EventModel.remove({ alert:doc._id }, function(err){
    if(err) throw err;
  });

});

AlertSchema.virtual('adsetData', {
  ref: 'Adset',
  localField: 'typeId',
  foreignField: 'adset_id'
});
mongoose.model('Alert', AlertSchema);
