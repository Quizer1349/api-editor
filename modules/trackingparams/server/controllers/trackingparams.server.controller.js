'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Trackingparam = mongoose.model('Trackingparam'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Trackingparam
 */
exports.create = function(req, res) {
  var trackingparam = new Trackingparam(req.body);
  trackingparam.user = req.user;
  

  trackingparam.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(trackingparam);
    }
  });
};

/**
 * Show the current Trackingparam
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var trackingparam = req.trackingparam ? req.trackingparam.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  trackingparam.isCurrentUserOwner = req.user && trackingparam.user && trackingparam.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(trackingparam);
};

/**
 * Update a Trackingparam
 */
exports.update = function(req, res) {
  var trackingparam = req.trackingparam ;

  trackingparam = _.extend(trackingparam , req.body);

  trackingparam.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(trackingparam);
    }
  });
};

/**
 * Delete an Trackingparam
 */
exports.delete = function(req, res) {
  var trackingparam = req.trackingparam ;

  trackingparam.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(trackingparam);
    }
  });
};

/**
 * List of Trackingparams
 */
exports.list = function(req, res) {
  var current_page = (req.query.page > 0) ? parseInt(req.query.page) - 1 : 0;
  var limit = req.query.count ? parseInt(req.query.count) : 100;
  var skip = (current_page * limit);
  var count = limit;
  var result = {};
  var condition = {};
  if(req.user){
    condition.user = req.user._id;
  }
  Trackingparam.count(condition).exec(function (error, totalCount) {
    if (error) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(error)
      });
    } else {
      var pages = (count !== 0) ? Math.ceil(totalCount/count) : 0;
      Trackingparam.find(condition).sort(req.query.sort).limit(limit).skip(skip).populate('user', 'displayName').exec(function(err, trackingparams) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          result = {
            'header': [
              {
                'key': 'name',
                'name': 'Label',
                'style': {},
                'class': []
              },
              {
                'key': 'value',
                'name': 'Value',
                'style': {},
                'class': []
              },
              {
                'key': 'description',
                'name': 'Description',
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
            'rows': trackingparams,
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
 * Trackingparam middleware
 */
exports.trackingparamByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Trackingparam is invalid'
    });
  }

  Trackingparam.findById(id).populate('user', 'displayName').exec(function (err, trackingparam) {
    if (err) {
      return next(err);
    } else if (!trackingparam) {
      return res.status(404).send({
        message: 'No Trackingparam with that identifier has been found'
      });
    }
    req.trackingparam = trackingparam;
    next();
  });
};
