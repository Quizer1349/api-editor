/**
 * Created by eugen on 07/07/16.
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Adset Schema
 */
var AdAccountSchema = new Schema({
  user:{
    type:Schema.ObjectId,
    ref: 'User'
  },
  account_id:{
    type:String,
    required: 'Please fill in account_id',
    trim: true
  },
  account_name:{
    type:String,
    required: 'Please fill in account_name',
    trim: true
  },
  status:{
    type:String
  },
  updated: {
    type: Date,
    default: Date.now
  },

  created: {
    type: Date,
    default: Date.now
  },
});

mongoose.model('Adaccount', AdAccountSchema);
