'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Adset = mongoose.model('Adset'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Adset
 */
exports.create = function(req, res) {
  var adset = new Adset(req.body);
  adset.user = req.user;

  adset.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adset);
    }
  });
};

/**
 * Show the current Adset
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var adset = req.adset ? req.adset.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  adset.isCurrentUserOwner = req.user && adset.user && adset.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(adset);
};

/**
 * Update a Adset
 */
exports.update = function(req, res) {
  var adset = req.adset ;

  adset = _.extend(adset , req.body);

  adset.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adset);
    }
  });
};

/**
 * Delete an Adset
 */
exports.delete = function(req, res) {
  var adset = req.adset ;

  adset.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adset);
    }
  });
};

/**
 * List of Adsets
 */
exports.list = function(req, res) {
  var current_page = (req.query.page > 0) ? parseInt(req.query.page) - 1 : 0;
  var limit = parseInt(req.query.count);
  var skip = (current_page * limit);
  var count = parseInt(req.query.count);
  var condition = {};
  var result = {};
  var filters = {
    adset_name: ''
  };

  if (req.query.filters) {
    filters = JSON.parse(req.query.filters);
  }
  if(req.user){
    condition.user = req.user._id;
  }
  if(filters.adset_name){
    condition.adset_name = { '$regex': filters.adset_name, '$options': 'i' };
  }

  Adset.count(condition).exec(function (error, totalCount) {
    if (error) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(error)
      });
    } else {
      var pages = (count !== 0) ? Math.ceil(totalCount/count) : 0;

      Adset.find(condition).sort(req.query.sort).limit(limit).skip(skip).populate('user', 'displayName').exec(function (err, adsets) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          result = {
            'header': [
              {
                'key': 'camp_name',
                'name': 'Campain Name',
                'style': {},
                'class': []
              },
              {
                'key': 'adset_name',
                'name': 'Adset Name',
                'style': {},
                'class': []
              },
              {
                'key': 'adset_id',
                'name': 'adset id',
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
                'key': 'reach',
                'name': 'Reach',
                'style': {},
                'class': []
              },
              {
                'key': 'daily_budget',
                'name': 'Daily Budget $',
                'style': {},
                'class': []
              },
              {
                'key': 'spent',
                'name': 'Spent',
                'style': {},
                'class': []
              },
              {
                'key': 'schedule',
                'name': 'Schedule',
                'style': {},
                'class': []
              },
              {
                'key': 'type',
                'name': 'Type',
                'style': {},
                'class': []
              },
              {
                'key': 'user',
                'name': 'User',
                'style': {},
                'class': []
              }
            ],
            'rows': adsets,
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
 * Search in adsets
 */
exports.search = function(req, res) {
  var regex = new RegExp(req.query.find, 'i');
  Adset.find({ user: req.user._id, $or:[{ adset_id: regex },{ status: regex },{ type: regex }] }).sort('-created').populate('user', 'displayName').exec(function(err, adsets) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adsets);
    }
  });
};

/**
 * Adset middleware
 */
exports.adsetByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Adset is invalid'
    });
  }

  Adset.findById(id).populate('user', 'displayName').exec(function (err, adset) {
    if (err) {
      return next(err);
    } else if (!adset) {
      return res.status(404).send({
        message: 'No Adset with that identifier has been found'
      });
    }
    req.adset = adset;
    next();
  });
};
