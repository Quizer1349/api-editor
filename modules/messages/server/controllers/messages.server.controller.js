'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Message = mongoose.model('Message'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Message
 */
exports.create = function(req, res) {
  var message = new Message(req.body);
  message.user = req.user;

  message.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(message);
    }
  });
};

/**
 * Show the current Message
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var message = req.message ? req.message.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  message.isCurrentUserOwner = req.user && message.user && message.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(message);
};

/**
 * Update a Message
 */
exports.update = function(req, res) {
  var message = req.message ;

  message = _.extend(message , req.body);

  message.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(message);
    }
  });
};

/**
 * Delete an Message
 */
exports.delete = function(req, res) {
  var message = req.message ;

  message.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(message);
    }
  });
};

/**
 * List of Messages
 */
exports.list = function(req, res) {
  var current_page = (req.query.page > 0) ? parseInt(req.query.page) - 1 : 0;
  var limit = parseInt(req.query.count);
  var skip = (current_page * limit);
  var count = parseInt(req.query.count);
  var result = {};
  var condition = {};
  if(req.user){
    condition.user = req.user._id;
  }

  Message.count(condition).exec(function (error, totalCount) {
    if (error) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(error)
      });
    } else {
      var pages = (count !== 0) ? Math.ceil(totalCount/count) : 0;

      Message.find(condition).sort(req.query.sort).limit(limit).skip(skip).populate([{ path:'user', select:'displayName' }, { path:'alert', select:'name' }]).populate('adsetData').exec(function(err, messages) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var newMessages  = [];
          messages.forEach(function(message){
            var adsetsIdsList = '';
            var adsetsNamesList = '';
            var alertNames = '';
            if(message.adsetData)
            {
              message.adsetData.forEach(function(adset){
                if(adset) {
                  adsetsIdsList += adset.adset_id + '\n';
                  adsetsNamesList += adset.adset_name + '\n';
                }
              });
              if(message.alert) {
                if(message.alert instanceof Array) {
                  message.alert.forEach(function (alert) {
                    alertNames += alert.name + '\n';
                  });
                }else {
                  alertNames = alert;
                }
              }
            }

            message.adset = { ids:adsetsIdsList, names: adsetsNamesList, alerts: alertNames };
            newMessages.push(message);
          });
          messages = newMessages;

//          console.log(messages);

          result = {
            'header': [
              {
                'key': 'name',
                'name': 'Alert Name',
                'style': {},
                'class': []
              },
              {
                'key': 'adset_id',
                'name': 'Adset ID',
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
                'key': 'status',
                'name': 'Status',
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
                'key': 'message',
                'name': 'Message',
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
                'key': 'created',
                'name': 'Created',
                'style': {},
                'class': []
              }
            ],
            'rows': messages,
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
 * Message middleware
 */
exports.messageByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Message is invalid'
    });
  }

  Message.findById(id).populate('user', 'displayName').exec(function (err, message) {
    if (err) {
      return next(err);
    } else if (!message) {
      return res.status(404).send({
        message: 'No Message with that identifier has been found'
      });
    }
    req.message = message;
    next();
  });
};
