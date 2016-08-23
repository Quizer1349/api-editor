'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Alert = mongoose.model('Alert'),
  Trackingparam = mongoose.model('Trackingparam'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Alert
 */
exports.create = function(req, res) {
  var alert = new Alert(req.body);
  alert.typeId = req.body.typeId;
  alert.param = req.body.param.value;
  alert.paramLabel = req.body.param.name;
  alert.rule = req.body.rule.value;
  alert.period = req.body.period.value;
  alert.status = req.body.status.value;
  alert.user = req.user._id;
  alert.smsEnabled = req.body.smsEnabled;
  alert.messengerEnabled = req.body.messengerEnabled;
  alert.emailEnabled = req.body.emailEnabled;
  alert.adaccount_id = req.body.adaccount_id;
  alert.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(alert);
    }
  });
};

/**
 * Show the current Alert
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var alert = req.alert ? req.alert.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  alert.isCurrentUserOwner = req.user && alert.user && alert.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(alert);
};

/**
 * Update a Alert
 */
exports.update = function(req, res) {
  var alert = req.alert ;
  //alert = _.extend(alert , req.body);
  alert.name = req.body.name;
  alert.typeId = req.body.typeId;
  alert.param = req.body.param.value;
  alert.paramLabel = req.body.param.name;
  alert.rule = req.body.rule.value;
  alert.value = req.body.value;
  alert.period = req.body.period.value;
  alert.status = req.body.status.value;
  alert.user = req.user._id;
  alert.smsEnabled = req.body.smsEnabled;
  alert.messengerEnabled = req.body.messengerEnabled;
  alert.emailEnabled = req.body.emailEnabled;
  alert.adaccount_id = req.body.adaccount_id;
  alert.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(alert);
    }
  });
};

/**
 * Delete an Alert
 */
exports.delete = function(req, res) {
  var alert = req.alert ;
 

  alert.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(alert);
    }
  });
};

/**
 * List of Trackingparams
 */
exports.trackingparams = function(req, res) {
  Trackingparam.find().sort('-created').populate('user', 'displayName').exec(function(err, trackingparams) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(trackingparams);
    }
  });
};

/**
 * List of Alerts
 */
exports.list = function(req, res) {
  var current_page = (req.query.page > 0) ? parseInt(req.query.page) - 1 : 0;
  var limit = parseInt(req.query.count);
  var skip = (current_page * limit);
  var count = parseInt(req.query.count);
  var result = {};
  
  Alert.count({ user: req.user._id }).exec(function (error, totalCount) {
    if (error) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(error)
      });
    } else {
      var pages = (count !== 0) ? Math.ceil(totalCount/count) : 0;

      Alert.find({ user: req.user._id }).sort(req.query.sort).limit(limit).skip(skip).populate('user', 'displayName').exec(function (err, alerts) {
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
                'key': 'typeId',
                'name': 'Adset',
                'style': {},
                'class': []
              },
              {
                'key': 'paramLabel',
                'name': 'Tracking Param',
                'style': {},
                'class': []
              },
              {
                'key': 'rule',
                'name': 'Rule',
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
                'key': 'period',
                'name': 'Time Period',
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
                'key': 'action',
                'name': 'Action',
                'style': {},
                'class': []
              },
            ],
            'rows': alerts,
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
 * Alert middleware
 */
exports.alertByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Alert is invalid'
    });
  }

  Alert.findById(id).populate('user', 'displayName').exec(function (err, alert) {
    if (err) {
      return next(err);
    } else if (!alert) {
      return res.status(404).send({
        message: 'No Alert with that identifier has been found'
      });
    }
    req.alert = alert;
    next();
  });
};
