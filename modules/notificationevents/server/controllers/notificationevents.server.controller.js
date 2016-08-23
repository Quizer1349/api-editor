'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Notificationevent = mongoose.model('Notificationevent'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Notificationevent
 */
exports.create = function(req, res) {
  var notificationevent = new Notificationevent(req.body);
  notificationevent.user = req.user;

  notificationevent.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(notificationevent);
    }
  });
};

/**
 * Show the current Notificationevent
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var notificationevent = req.notificationevent ? req.notificationevent.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  notificationevent.isCurrentUserOwner = req.user && notificationevent.user && notificationevent.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(notificationevent);
};

/**
 * Update a Notificationevent
 */
exports.update = function(req, res) {
  var notificationevent = req.notificationevent ;

  notificationevent = _.extend(notificationevent , req.body);

  notificationevent.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(notificationevent);
    }
  });
};

/**
 * Delete an Notificationevent
 */
exports.delete = function(req, res) {
  var notificationevent = req.notificationevent ;

  notificationevent.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(notificationevent);
    }
  });
};

/**
 * List of Notificationevents
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

  Notificationevent.count(condition).exec(function (error, totalCount) {
    if (error) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(error)
      });
    } else {
      var pages = (count !== 0) ? Math.ceil(totalCount / count) : 0;

      Notificationevent.find(condition).sort(req.query.sort).limit(limit).skip(skip).populate([{
        path: 'user',
        select: 'displayName'
      }, {
        path: 'alert',
        select: 'name value rule period'
      }]).populate('adsetData').exec(function (err, notificationevents) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {

          result = {
            'header': [
              {
                'key': 'adset_name',
                'name': 'Adset Name',
                'style': {},
                'class': []
              },
              {
                'key': 'adset',
                'name': 'Adset ID',
                'style': {},
                'class': []
              },
              {
                'key': 'alert_name',
                'name': 'Alert Name',
                'style': {},
                'class': []
              },
              {
                'key': 'period_name',
                'name': 'Alert Period',
                'style': {},
                'class': []
              },
              {
                'key': 'param',
                'name': 'Param',
                'style': {},
                'class': []
              },
              {
                'key': 'value',
                'name': 'FB Value',
                'style': {},
                'class': []
              },
              {
                'key': 'alert_rule',
                'name': 'Alert Rule',
                'style': {},
                'class': []
              },
              {
                'key': 'alert_value',
                'name': 'Alert Value',
                'style': {},
                'class': []
              },
              {
                'key': 'created',
                'name': 'Created',
                'style': {},
                'class': []
              },
            ],
            'rows': notificationevents,
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
 * Notificationevent middleware
 */
exports.notificationeventByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Notificationevent is invalid'
    });
  }

  Notificationevent.findById(id).populate('user', 'displayName').exec(function (err, notificationevent) {
    if (err) {
      return next(err);
    } else if (!notificationevent) {
      return res.status(404).send({
        message: 'No Notificationevent with that identifier has been found'
      });
    }
    req.notificationevent = notificationevent;
    next();
  });
};
