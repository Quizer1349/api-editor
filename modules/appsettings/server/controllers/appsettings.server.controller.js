'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Appsetting = mongoose.model('Appsetting'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Appsetting
 */
exports.create = function(req, res) {
  var appsetting = new Appsetting(req.body);
  appsetting.user = req.user;

  appsetting.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(appsetting);
    }
  });
};

/**
 * Show the current Appsetting
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var appsetting = req.appsetting ? req.appsetting.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  appsetting.isCurrentUserOwner = req.user && appsetting.user && appsetting.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(appsetting);
};

/**
 * Update a Appsetting
 */
exports.update = function(req, res) {
  var appsetting = req.appsetting ;

  appsetting = _.extend(appsetting , req.body);

  appsetting.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(appsetting);
    }
  });
};

/**
 * Delete an Appsetting
 */
exports.delete = function(req, res) {
  var appsetting = req.appsetting ;

  appsetting.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(appsetting);
    }
  });
};

/**
 * List of Appsettings
 */
exports.list = function(req, res) {

  var current_page = (req.query.page > 0) ? parseInt(req.query.page) - 1 : 0;
  var limit = parseInt(req.query.count);
  var skip = (current_page * limit);
  var count = parseInt(req.query.count);
  var result = {};

  Appsetting.count().exec(function (error, totalCount) {
    if (error) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(error)
      });
    } else {
      var pages = (count !== 0) ? Math.ceil(totalCount/count) : 0;

      Appsetting.find().sort(req.query.sort).limit(limit).skip(skip).populate('user', 'displayName').exec(function(err, appsettings) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          result = {
            'header': [
              {
                'key': 'name',
                'name': 'Name',
                'style': {},
                'class': []
              },
              {
                'key': 'value',
                'name': 'Value',
                'style': {},
                'class': []
              }
            ],
            'rows': appsettings,
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
 * Appsetting middleware
 */
exports.appsettingByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Appsetting is invalid'
    });
  }

  Appsetting.findById(id).populate('user', 'displayName').exec(function (err, appsetting) {
    if (err) {
      return next(err);
    } else if (!appsetting) {
      return res.status(404).send({
        message: 'No Appsetting with that identifier has been found'
      });
    }
    req.appsetting = appsetting;
    next();
  });
};
