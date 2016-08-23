'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Adset Schema
 */
var AdsetSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  adset_id:{
    type:String,
    required: 'Please fill in adset_name',
    trim: true
  },
  adset_name:{
    type:String,
    required: 'Please fill in adset_name',
    trim: true
  },
  status:{
    type: String,
    required: 'Please fill in adset_name',
    trim: true
  },
  type:{
    type:String,
    required: 'Please fill in adset_name',
    trim: true
  },
  camp_id:{
    type:String,
    required: 'Please fill in adset_name',
    trim: true
  },
  camp_name:{
    type:String,
    required: 'Please fill in adset_name',
    trim: true
  },
  daily_budget:{
    type:Number,
    required: 'Please fill in adset_name',
    trim: true
  },
  amount_spent:{
    type:Number,
    required: 'Please fill in adset_name',
    trim: true
  },
  reach:{
    type:Number,
    required: 'Please fill in adset_name',
    trim: true
  },
  start_time:{
    type:String,
    required: 'Please fill in adset_name',
    trim: true
  },
  end_time:{
    type:String,
    required: 'Please fill in adset_name',
    trim: true
  },
  schedule:{
    type:String,
    required: 'Please fill in adset_name',
    trim: true
  },
  updated: {
    type: Date,
    default: Date.now
  },
  adaccount_id:{
    type:String,
    required: 'Please fill in adset_name',
    trim: true
  },

  created: {
    type: Date,
    default: Date.now
  },
});

mongoose.model('Adset', AdsetSchema);
