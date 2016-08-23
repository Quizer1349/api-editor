'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Adminnotification = mongoose.model('Adminnotification'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Adminnotification
 */
exports.create = function (req, res) {
  var adminnotification = new Adminnotification(req.body);
  adminnotification.user = req.user;

  adminnotification.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminnotification);
    }
  });
};

/**
 * Show the current Adminnotification
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
  var adminnotification = req.adminnotification ? req.adminnotification.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  adminnotification.isCurrentUserOwner = req.user && adminnotification.user && adminnotification.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(adminnotification);
};

/**
 * Update a Adminnotification
 */
exports.update = function (req, res) {
  var adminnotification = req.adminnotification;

  adminnotification = _.extend(adminnotification, req.body);

  adminnotification.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminnotification);
    }
  });
};

/**
 * Delete an Adminnotification
 */
exports.delete = function (req, res) {
  var adminnotification = req.adminnotification;

  adminnotification.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adminnotification);
    }
  });
};

/**
 * List of Adminnotifications
 */
exports.list = function (req, res) {
  var current_page = (req.query.page > 0) ? parseInt(req.query.page) - 1 : 0;
  var limit = parseInt(req.query.count);
  var skip = (current_page * limit);
  var count = parseInt(req.query.count);
  var result = {};
  Adminnotification.count({ user: req.user._id }).exec(function (error, totalCount) {
    if (error) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(error)
      });
    } else {
      var pages = (count !== 0) ? Math.ceil(totalCount / count) : 0;
      Adminnotification.find({ user: req.user._id }).sort(req.query.sort).limit(limit).skip(skip).populate('user', 'displayName').exec(function (err, adminnotifications) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          result = {
            'header': [
              {
                'key': 'text',
                'name': 'Text',
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
                'key': 'created',
                'name': 'Created',
                'style': {},
                'class': []
              }
            ],
            'rows': adminnotifications,
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
 * Adminnotification middleware
 */
exports.adminnotificationByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Adminnotification is invalid'
    });
  }

  Adminnotification.findById(id).populate('user', 'displayName').exec(function (err, adminnotification) {
    if (err) {
      return next(err);
    } else if (!adminnotification) {
      return res.status(404).send({
        message: 'No Adminnotification with that identifier has been found'
      });
    }
    req.adminnotification = adminnotification;
    next();
  });
};

/**
 * Send Adminnotification
 */
exports.send = function (req, res) {
  var adminnotification = req.adminnotification;
  var UsersModel = mongoose.model('User');
  var FbRequesterClass = require(path.resolve('./modules/fbrequester/index'));
  var fbRequester = new FbRequesterClass();
  var usersCondition = {
    messengerId: { '$ne': '' }
        // messengerAlert : true,
        // '_id' : {'$ne' : req.user._id}
  };

  function goOn(count, totalCount) {
    console.log(count);
    if (count === totalCount) {
      res.jsonp({
        message: 'SUCCESS!',
        count: count
      });
    }
  }

  UsersModel.find(usersCondition).exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else if (users.length === 0) {
      return res.status(404).send({
        message: 'No Recipients Found'
      });
    }
        else {
      var messageData = {
        recipient: {
          id: ''
        },
        message: {
          text: adminnotification.text
        }
      };
      var count = 0;
      var totalCount = users.length;
      users.forEach(function (user) {
        messageData.recipient.id = user.messengerId;
        fbRequester.sendMessengerNotification(messageData, function(status){
          count++;
          goOn(count, totalCount);
        });
      });
    }
  });
};
