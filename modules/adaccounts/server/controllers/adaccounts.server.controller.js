'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Adaccount = mongoose.model('Adaccount'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Adaccount
 */
exports.create = function(req, res) {
  var adaccount = new Adaccount(req.body);
  adaccount.user = req.user;

  adaccount.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adaccount);
    }
  });
};

/**
 * Show the current Adaccount
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var adaccount = req.adaccount ? req.adaccount.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  adaccount.isCurrentUserOwner = req.user && adaccount.user && adaccount.user._id.toString() === req.user._id.toString() ? true : false;
  res.jsonp(adaccount);
};

/**
 * Update a Adaccount
 */
exports.update = function(req, res) {
  var adaccount = req.adaccount ;

  adaccount = _.extend(adaccount , req.body);

  adaccount.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adaccount);
    }
  });
};

/**
 * Delete an Adaccount
 */
exports.delete = function(req, res) {
  var adaccount = req.adaccount ;

  adaccount.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adaccount);
    }
  });
};

/**
 * List of Adaccounts
 */
exports.list = function(req, res) {
  var current_page = (req.query.page > 0) ? parseInt(req.query.page) - 1 : 0;
  var limit = parseInt(req.query.count);
  var skip = (current_page * limit);
  var count = parseInt(req.query.count);
  var result = {};
  var condition ={};
  var filters = {
    account_name: ''
  };

  if (req.query.filters) {
    filters = JSON.parse(req.query.filters);
  }

  if(req.user){
    condition.user = req.user._id;
  }
  if(filters.account_name){
    condition.account_name= { '$regex': filters.account_name, '$options': 'i' };
  }

  Adaccount.count(condition).exec(function (error, totalCount) {


    if (error) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(error)
      });
    } else {
      var pages = (count !== 0) ? Math.ceil(totalCount/count) : 0;

      Adaccount.find(condition).sort(req.query.sort).limit(limit).skip(skip).populate([{
        path: 'user',
        select: 'displayName'
      }, {
        path: 'alert',
        select: 'name value rule period'
      }]).populate('adsetData').exec(function (err, adaccounts) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          result = {
            'header': [
              {
                'key': 'account_id',
                'name': 'Account ID',
                'style': {},
                'class': []
              },
              {
                'key': 'account_name',
                'name': 'Account Name',
                'style': {},
                'class': []
              },
              {
                'key': 'status',
                'name': 'Status',
                'style': {},
                'class': []
              },
              {
                'key': 'user',
                'name': 'User',
                'style': {},
                'class': []
              },
              {
                'key': 'action',
                'name': 'Action',
                'style': {},
                'class': []
              }
            ],
            'rows': adaccounts,
            'pagination': { 'count': count, 'page': req.query.page, 'pages': pages, 'size': totalCount },
            'sort-by': req.query.sortBy,
            'sort-order': req.query.sortOrder
          };
          res.jsonp(result);
        }
      });
    }
  });
};

/**
 * Adaccount middleware
 */
exports.adaccountByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Adaccount is invalid'
    });
  }

  Adaccount.findById(id).populate('user', 'displayName').exec(function (err, adaccount) {
    if (err) {
      return next(err);
    } else if (!adaccount) {
      return res.status(404).send({
        message: 'No Adaccount with that identifier has been found'
      });
    }
    req.adaccount = adaccount;
    next();
  });
};
